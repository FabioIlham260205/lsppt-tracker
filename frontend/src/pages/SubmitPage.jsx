import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  DatePicker,
  EmptyState,
  Input,
  Loading,
  Select,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
  useToast,
} from '../components/ui';
import { getEmployees, getPhases, saveLsppt } from '../api/lsppt.js';

const CLICKUP_ID_PATTERN = /\/([a-z0-9]+)\/?$/i;

const EMPTY_TASK_FORM = {
  title: '',
  clickupUrl: '',
  clickupTaskId: '',
  phase: '',
  status: '',
};

let taskSeq = 0;

function extractClickUpId(url) {
  const match = url.match(CLICKUP_ID_PATTERN);
  return match ? match[1] : null;
}

function statusBadgeVariant(status) {
  const s = status.toLowerCase();
  if (s.startsWith('completed')) return 'success';
  if (s.includes('progress') || s.includes('testing') || s.includes('documentation')) return 'info';
  if (s.includes('hold') || s.includes('feedback')) return 'warning';
  return 'neutral';
}

export default function SubmitPage() {
  const { showToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [phases, setPhases] = useState({});
  const [metaLoading, setMetaLoading] = useState(true);

  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);
  const [rowErrors, setRowErrors] = useState({});
  const [tasks, setTasks] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getEmployees(), getPhases()])
      .then(([empRes, phaseRes]) => {
        if (cancelled) return;
        setEmployees(empRes.data);
        setPhases(phaseRes.data);
      })
      .catch((err) => {
        if (cancelled) return;
        showToast({
          type: 'error',
          title: 'Gagal memuat data',
          message: err.response?.data?.message || err.message,
        });
      })
      .finally(() => {
        if (!cancelled) setMetaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const phaseOptions = Object.keys(phases);
  const statusOptions = taskForm.phase ? phases[taskForm.phase] ?? [] : [];

  const handleTaskFormChange = (field) => (e) => {
    const { value } = e.target;

    if (field === 'phase') {
      setTaskForm((prev) => ({ ...prev, phase: value, status: '' }));
      setRowErrors((prev) => ({ ...prev, phase: undefined, status: undefined }));
      return;
    }

    if (field === 'clickupUrl') {
      const extracted = extractClickUpId(value);
      setTaskForm((prev) => ({
        ...prev,
        clickupUrl: value,
        ...(extracted ? { clickupTaskId: extracted } : {}),
      }));
      setRowErrors((prev) =>
        extracted
          ? { ...prev, clickupUrl: undefined, clickupTaskId: undefined }
          : { ...prev, clickupUrl: undefined }
      );
      return;
    }

    setTaskForm((prev) => ({ ...prev, [field]: value }));
    setRowErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateTaskForm = () => {
    const errs = {};
    if (!taskForm.title.trim()) errs.title = 'Judul tugas wajib diisi';

    if (!taskForm.clickupUrl.trim()) errs.clickupUrl = 'ClickUp URL wajib diisi';
    else if (!extractClickUpId(taskForm.clickupUrl.trim()))
      errs.clickupUrl = 'Format URL tidak valid (contoh: https://app.clickup.com/t/86d43h365)';

    if (!taskForm.clickupTaskId.trim()) errs.clickupTaskId = 'ClickUp Task ID wajib diisi';
    else if (
      tasks.some(
        (t) => t.clickup_task_id.toLowerCase() === taskForm.clickupTaskId.trim().toLowerCase()
      )
    )
      errs.clickupTaskId = 'Task ID sudah ada di daftar';

    if (!taskForm.phase) errs.phase = 'Pilih phase';
    if (!taskForm.status) errs.status = 'Pilih status';

    return errs;
  };

  const handleAddTask = () => {
    const errs = validateTaskForm();
    setRowErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setTasks((prev) => [
      ...prev,
      {
        uid: ++taskSeq,
        title: taskForm.title.trim(),
        clickup_url: taskForm.clickupUrl.trim(),
        clickup_task_id: taskForm.clickupTaskId.trim(),
        phase: taskForm.phase,
        status: taskForm.status,
      },
    ]);
    setTaskForm(EMPTY_TASK_FORM);
  };

  const handleRemoveTask = (uid) => {
    setTasks((prev) => prev.filter((t) => t.uid !== uid));
  };

  const handleSave = async () => {
    const errs = {};
    if (!employeeId) errs.employeeId = 'Pilih karyawan';
    if (!date) errs.date = 'Pilih tanggal';
    if (tasks.length === 0) errs.tasks = 'Tambahkan minimal satu task sebelum menyimpan';
    setFormErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast({
        type: 'error',
        title: 'Form belum lengkap',
        message: 'Lengkapi karyawan, tanggal, dan tambahkan minimal satu task.',
      });
      return;
    }

    const payload = {
      employee_id: Number(employeeId),
      date,
      tasks: tasks.map(({ title, clickup_url, clickup_task_id, phase, status }) => ({
        title,
        clickup_url,
        clickup_task_id,
        phase,
        status,
      })),
    };

    setSaving(true);
    try {
      const res = await saveLsppt(payload);
      showToast({
        type: 'success',
        title: 'Berhasil',
        message: res.message || 'LSPPT saved successfully',
      });
      setTasks([]);
      setTaskForm(EMPTY_TASK_FORM);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      showToast({
        type: 'error',
        title: err.status === 409 ? 'Task duplikat' : 'Gagal menyimpan LSPPT',
        message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (metaLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">LSPPT Tracker</h1>
            <p className="mt-1 text-sm text-slate-500">
              Laporan Status Progress Pekerjaan Karyawan
            </p>
          </div>
          <Link
            to="/history"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Lihat History →
          </Link>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Informasi Umum
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Employee"
              placeholder="Pilih karyawan"
              options={employees.map((emp) => ({ value: emp.id, label: emp.name }))}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              error={formErrors.employeeId}
            />
            <DatePicker
              label="Tanggal"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={formErrors.date}
            />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Tambah Task
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Task Title"
                placeholder="Contoh: CTMS - Issue List Report"
                value={taskForm.title}
                onChange={handleTaskFormChange('title')}
                error={rowErrors.title}
              />
            </div>
            <Input
              label="ClickUp URL"
              type="url"
              placeholder="https://app.clickup.com/t/86d43h365"
              value={taskForm.clickupUrl}
              onChange={handleTaskFormChange('clickupUrl')}
              error={rowErrors.clickupUrl}
            />
            <Input
              label="ClickUp Task ID"
              placeholder="Otomatis terisi dari URL"
              value={taskForm.clickupTaskId}
              onChange={handleTaskFormChange('clickupTaskId')}
              error={rowErrors.clickupTaskId}
            />
            <Select
              label="Phase"
              placeholder="Pilih phase"
              options={phaseOptions.map((p) => ({ value: p, label: p }))}
              value={taskForm.phase}
              onChange={handleTaskFormChange('phase')}
              error={rowErrors.phase}
            />
            <Select
              label="Status"
              placeholder={taskForm.phase ? 'Pilih status' : 'Pilih phase terlebih dahulu'}
              options={statusOptions.map((s) => ({ value: s, label: s }))}
              value={taskForm.status}
              onChange={handleTaskFormChange('status')}
              disabled={!taskForm.phase}
              error={rowErrors.status}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={handleAddTask}>
              + Add Task
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Daftar Task ({tasks.length})
            </h2>
            {formErrors.tasks && <p className="text-xs text-red-600">{formErrors.tasks}</p>}
          </div>

          {tasks.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState
                title="Belum ada task"
                description="Isi form di atas lalu klik “+ Add Task” untuk menambahkan task ke daftar."
                className="border-0 py-8"
              />
            </div>
          ) : (
            <Table>
              <THead>
                <Tr>
                  <Th className="w-12">No</Th>
                  <Th>Task</Th>
                  <Th>ClickUp ID</Th>
                  <Th>Phase</Th>
                  <Th>Status</Th>
                  <Th className="w-24 text-right">Aksi</Th>
                </Tr>
              </THead>
              <TBody>
                {tasks.map((task, index) => (
                  <Tr key={task.uid}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <p className="font-medium text-slate-800">{task.title}</p>
                      <a
                        href={task.clickup_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {task.clickup_url}
                      </a>
                    </Td>
                    <Td>
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                        {task.clickup_task_id}
                      </code>
                    </Td>
                    <Td>{task.phase}</Td>
                    <Td>
                      <Badge variant={statusBadgeVariant(task.status)}>{task.status}</Badge>
                    </Td>
                    <Td className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveTask(task.uid)}
                      >
                        Hapus
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-500">
              {tasks.length > 0
                ? `${tasks.length} task siap disimpan untuk ${date || 'tanggal terpilih'}`
                : 'Belum ada task yang ditambahkan.'}
            </p>
            <Button type="button" size="lg" loading={saving} onClick={handleSave}>
              Save LSPPT
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
