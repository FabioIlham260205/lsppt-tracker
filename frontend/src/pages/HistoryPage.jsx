import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  DatePicker,
  EmptyState,
  Input,
  Loading,
  Modal,
  Select,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
  useToast,
} from '../components/ui';
import { getEmployees, getHistory, getTaskHistory, exportHistory, getPhases, updateTaskProgress } from '../api/lsppt';

const STATUS_VARIANT = {
  Completed: 'success',
  'Completed Testing': 'success',
  Documentation: 'info',
  'In Progress': 'info',
  'On Hold': 'danger',
  Plan: 'neutral',
  'Completed with Feedback': 'warning',
  Testing: 'warning',
  'On Queue Testing': 'warning',
};

const DOT_BORDER = {
  success: 'border-green-500',
  info: 'border-blue-500',
  warning: 'border-amber-500',
  danger: 'border-red-500',
  neutral: 'border-slate-400',
};

const DOT_FILL = {
  success: 'bg-green-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  neutral: 'bg-slate-400',
};

const TIME_PERIODS = {
  'minggu-ini': 'Minggu Ini',
  'bulan-ini': 'Bulan Ini',
  'tahun-ini': 'Tahun Ini',
  'semua': 'Semua',
};

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function defaultRange() {
  const now = new Date();
  return {
    from: toISODate(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: toISODate(now),
  };
}

function getPeriodRange(period) {
  const now = new Date();
  switch (period) {
    case 'minggu-ini': {
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      return { from: toISODate(startOfWeek), to: toISODate(now) };
    }
    case 'bulan-ini':
      return { from: toISODate(new Date(now.getFullYear(), now.getMonth(), 1)), to: toISODate(now) };
    case 'tahun-ini':
      return { from: toISODate(new Date(now.getFullYear(), 0, 1)), to: toISODate(now) };
    case 'semua':
      return { from: '', to: '' };
    default:
      return defaultRange();
  }
}

const DATE_FMT = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(iso) {
  if (!iso) return '-';
  return DATE_FMT.format(new Date(iso));
}

function StatusBadge({ status }) {
  return <Badge variant={STATUS_VARIANT[status] || 'neutral'}>{status}</Badge>;
}

function TimelineDot({ variant, isLatest }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-white ${
        DOT_BORDER[variant]
      } ${isLatest ? DOT_FILL[variant] : ''}`}
    />
  );
}

function DetailModal({ open, onClose, row }) {
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [phases, setPhases] = useState({});
  const [showUpdate, setShowUpdate] = useState(false);
  const [updatePhase, setUpdatePhase] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  const [updateErrors, setUpdateErrors] = useState({});
  const [updating, setUpdating] = useState(false);

  const { showToast } = useToast();

  function loadHistory() {
    if (!row) return;
    setLoading(true);
    setError(null);
    getTaskHistory(row.task_id)
      .then((res) => setEntries(res.data))
      .catch((err) => setError(err?.message || 'Terjadi kesalahan tak terduga.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!open || !row) return undefined;
    loadHistory();
    setUpdatePhase(row.phase);
    setUpdateStatus(row.status);
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setUpdateDate(`${y}-${m}-${d}`);
    setShowUpdate(false);
    setUpdateErrors({});
    return () => {};
  }, [open, row]);

  useEffect(() => {
    if (!open) return;
    getPhases()
      .then((res) => setPhases(res.data))
      .catch(() => {});
  }, [open]);

  const statusOptions = updatePhase ? phases[updatePhase] ?? [] : [];

  function handlePhaseChange(e) {
    const val = e.target.value;
    setUpdatePhase(val);
    if (val && !phases[val]?.includes(updateStatus)) {
      setUpdateStatus('');
    }
  }

  function handleSubmitUpdate() {
    const errs = {};
    if (!updatePhase) errs.phase = 'Pilih phase';
    if (!updateStatus) errs.status = 'Pilih status';
    if (!updateDate) errs.date = 'Pilih tanggal';
    setUpdateErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setUpdating(true);
    updateTaskProgress(row.task_id, {
      phase: updatePhase,
      status: updateStatus,
      date: updateDate,
    })
      .then(() => {
        showToast({ type: 'success', title: 'Berhasil', message: 'Progress berhasil diperbarui' });
        setShowUpdate(false);
        loadHistory();
      })
      .catch((err) => {
        showToast({
          type: 'error',
          title: 'Gagal',
          message: err.status === 409 ? 'Progress untuk tanggal ini sudah ada' : (err.message || 'Terjadi kesalahan'),
        });
      })
      .finally(() => setUpdating(false));
  }

  const lastUpdated = entries?.length ? entries[entries.length - 1].date : null;

  return (
    <Modal open={open} onClose={onClose} title={row ? row.task : 'Detail Task'} size="lg">
      {row && (
        <>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-5">
            <div>
              <dt className="text-xs text-slate-400">Karyawan</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">{row.employee}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">ClickUp ID</dt>
              <dd className="mt-0.5 font-mono text-xs text-slate-700">{row.clickup_task_id}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Phase saat ini</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">{row.phase}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Status saat ini</dt>
              <dd className="mt-1">
                <StatusBadge status={row.status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Last Updated</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">
                {lastUpdated ? formatDate(lastUpdated) : '-'}
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Riwayat Progress
            </p>

            {loading && (
              <div className="flex flex-col items-center gap-3 py-10" role="status" aria-busy="true">
                <Loading size="md" />
                <p className="text-sm text-slate-500">Memuat riwayat progress…</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center gap-3 py-8" role="alert">
                <p className="text-sm text-red-600">{error}</p>
                <p className="text-xs text-slate-400">
                  Riwayat progress tidak dapat dimuat.
                </p>
                <Button size="sm" variant="outline" onClick={loadHistory}>
                  Coba Lagi
                </Button>
              </div>
            )}

            {!loading && !error && entries && entries.length > 0 && (
              <ol className="relative ml-2 mt-4 border-l-2 border-slate-100" aria-label="Riwayat progress">
                {entries.map((entry, index) => {
                  const variant = STATUS_VARIANT[entry.status] || 'neutral';
                  const isLatest = index === entries.length - 1;
                  const prevEntry = index > 0 ? entries[index - 1] : null;
                  const phaseChanged = prevEntry && prevEntry.phase !== entry.phase;
                  return (
                    <Fragment key={`${entry.date}-${entry.status}`}>
                      {phaseChanged && (
                        <li className="relative pb-3 pl-7" aria-hidden="true">
                          <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-dashed border-slate-300 bg-white" />
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Phase: {prevEntry.phase} → {entry.phase}
                          </span>
                        </li>
                      )}
                      <li className={`relative ${phaseChanged ? 'pt-1' : ''} pb-6 pl-7 last:pb-1`}>
                        <TimelineDot variant={variant} isLatest={isLatest} />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`text-sm ${
                              isLatest ? 'font-semibold text-slate-800' : 'text-slate-600'
                            }`}
                          >
                            {formatDate(entry.date)}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{entry.phase}</span>
                            <StatusBadge status={entry.status} />
                          </span>
                        </div>
                        {isLatest && (
                          <p className="mt-1 text-xs text-slate-400">Kondisi terakhir tugas ini.</p>
                        )}
                      </li>
                    </Fragment>
                  );
                })}
              </ol>
            )}

            {!loading && !error && entries && entries.length === 0 && (
              <p className="py-6 text-sm text-slate-500">Task ini belum memiliki riwayat progress yang tercatat.</p>
            )}
          </div>

          {showUpdate && (
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                Update Progress
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Select
                  label="Phase"
                  placeholder="Pilih phase"
                  options={Object.keys(phases).map((p) => ({ value: p, label: p }))}
                  value={updatePhase}
                  onChange={handlePhaseChange}
                  error={updateErrors.phase}
                />
                <Select
                  label="Status"
                  placeholder={updatePhase ? 'Pilih status' : 'Pilih phase dulu'}
                  options={statusOptions.map((s) => ({ value: s, label: s }))}
                  value={updateStatus}
                  onChange={(e) => { setUpdateStatus(e.target.value); setUpdateErrors((p) => ({ ...p, status: undefined })); }}
                  disabled={!updatePhase}
                  error={updateErrors.status}
                />
                <DatePicker
                  label="Tanggal"
                  value={updateDate}
                  onChange={(e) => { setUpdateDate(e.target.value); setUpdateErrors((p) => ({ ...p, date: undefined })); }}
                  error={updateErrors.date}
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowUpdate(false)}>
                  Batal
                </Button>
                <Button type="button" size="sm" loading={updating} onClick={handleSubmitUpdate}>
                  Simpan Progress
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            {!showUpdate && (
              <Button variant="primary" onClick={() => setShowUpdate(true)}>
                Update Progress
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default function HistoryPage() {
  const initialRange = useMemo(defaultRange, []);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activePeriod, setActivePeriod] = useState('bulan-ini');

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRow, setSelectedRow] = useState(null);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    getEmployees()
      .then((res) => {
        if (!cancelled) setEmployees(res.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function loadHistory() {
    setLoading(true);
    setError(null);
    getHistory({ employee_id: employeeId || undefined, from: from || undefined, to: to || undefined })
      .then((res) => setRows(res.data))
      .catch((err) => setError(err?.message || 'Terjadi kesalahan tak terduga.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, from, to]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const dateInvalid = Boolean(from && to && from > to);

  const employeeName = employees.find((e) => String(e.id) === employeeId)?.name;

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return rows
      .filter((row) => {
        if (employeeName && row.employee !== employeeName) return false;
        if (from && row.date < from) return false;
        if (to && row.date > to) return false;
        if (query) {
          const haystack = `${row.task} ${row.clickup_task_id} ${row.employee} ${row.phase} ${row.status}`.toLowerCase();
          if (!haystack.includes(query)) return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [rows, employeeName, from, to, debouncedSearch]);

  const hasActiveFilter =
    Boolean(employeeId) ||
    Boolean(search.trim()) ||
    activePeriod !== 'bulan-ini' ||
    from !== initialRange.from ||
    to !== initialRange.to;

  function resetFilters() {
    setEmployeeId('');
    setSearch('');
    setDebouncedSearch('');
    setActivePeriod('bulan-ini');
    setFrom(initialRange.from);
    setTo(initialRange.to);
  }

  function handlePeriodChange(period) {
    setActivePeriod(period);
    const range = getPeriodRange(period);
    setFrom(range.from);
    setTo(range.to);
  }

  function openDetail(row) {
    setSelectedRow(row);
  }

  function handleRowClick(event, row) {
    if (event.target.closest('button')) return;
    openDetail(row);
  }

  function handleExport() {
    setExporting(true);
    exportHistory({ employee_id: employeeId || undefined, from: from || undefined, to: to || undefined })
      .then(() => {
        showToast({ type: 'success', title: 'Ekspor selesai', message: 'File berhasil diunduh.' });
      })
      .catch((err) => {
        showToast({ type: 'error', title: 'Gagal mengekspor', message: err?.message || 'Terjadi kesalahan tak terduga.' });
      })
      .finally(() => setExporting(false));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">History</h1>
            <p className="mt-1 text-sm text-slate-500">
              Rekap progres LSPPT harian semua karyawan.
            </p>
          </div>
          <a href="/submit" className="text-sm text-blue-600 hover:underline">
            &larr; Kembali ke Submit
          </a>
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr_auto] lg:items-end">
            <Select
              label="Karyawan"
              placeholder="Semua karyawan"
              options={employees.map((e) => ({ value: String(e.id), label: e.name }))}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <DatePicker
              label="Dari Tanggal"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setActivePeriod('custom');
              }}
              max={to || undefined}
              error={dateInvalid ? 'Lebih besar dari tanggal akhir' : undefined}
            />
            <DatePicker
              label="Sampai Tanggal"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setActivePeriod('custom');
              }}
              min={from || undefined}
              error={dateInvalid ? 'Lebih kecil dari tanggal mulai' : undefined}
            />
            <Input
              label="Cari"
              type="text"
              placeholder="Cari tugas atau ClickUp ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {hasActiveFilter && (
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset Filter
              </Button>
            )}
          </form>
        </section>

        <section className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          {!loading && !error && !dateInvalid && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 sm:px-6">
              <p className="text-xs font-medium text-slate-500">
                {filtered.length} entri ditemukan
              </p>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                  {Object.entries(TIME_PERIODS).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePeriodChange(key)}
                      className={`rounded-md px-3 py-1 text-xs font-medium text-center min-w-[72px] transition-colors ${
                        activePeriod === key
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className={`hidden text-xs text-slate-400 lg:block min-w-[140px] text-right ${!(from || to) && 'invisible'}`}>
                  {from || to ? `${formatDate(from)} – ${formatDate(to)}` : '\u00A0'}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  loading={exporting}
                  disabled={dateInvalid || loading || filtered.length === 0}
                  onClick={handleExport}
                >
                  Export Excel
                </Button>
              </div>
            </div>
          )}

          {dateInvalid ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 px-6 py-12 text-center" role="alert">
              <svg className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-medium text-slate-700">Rentang tanggal tidak valid</p>
              <p className="max-w-xs text-xs text-slate-400">
                Tanggal akhir lebih awal dari tanggal mulai. Sesuaikan salah satu tanggal untuk melihat history.
              </p>
            </div>
          ) : loading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-12" role="status" aria-busy="true">
              <Loading size="lg" />
              <p className="text-sm text-slate-500">Memuat riwayat…</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-12 text-center" role="alert">
              <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12m-9.303-3.382c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-medium text-slate-700">Gagal memuat data</p>
              <p className="max-w-xs text-xs text-slate-400">{error}</p>
              <Button size="sm" variant="outline" onClick={loadHistory}>
                Coba Lagi
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4 sm:p-6">
              <EmptyState
                title="Belum ada data yang cocok"
                description="Tidak ada entri history sesuai filter saat ini. Coba ubah karyawan, rentang tanggal, atau kata kunci pencarian."
                action={
                  hasActiveFilter ? (
                    <Button size="sm" variant="outline" onClick={resetFilters}>
                      Reset Filter
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <THead>
                  <Tr>
                    <Th>Karyawan</Th>
                    <Th>Tanggal</Th>
                    <Th>Tugas</Th>
                    <Th>ClickUp ID</Th>
                    <Th>Phase</Th>
                    <Th>Status</Th>
                  </Tr>
                </THead>
                <TBody>
                  {filtered.map((row) => (
                    <Tr
                      key={row.id}
                      tabIndex={0}
                      aria-label={`Buka detail tugas ${row.task}`}
                      onClick={(e) => handleRowClick(e, row)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openDetail(row);
                        }
                      }}
                      className="group cursor-pointer transition-colors duration-150 hover:bg-slate-50 focus-visible:bg-blue-50/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <Td className="whitespace-nowrap font-medium text-slate-800">{row.employee}</Td>
                      <Td className="whitespace-nowrap">{formatDate(row.date)}</Td>
                      <Td>
                        <button
                          type="button"
                          onClick={() => openDetail(row)}
                          className="text-left font-medium text-blue-600 group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          <span className="block max-w-[260px] truncate" title={row.task}>
                            {row.task}
                          </span>
                        </button>
                      </Td>
                      <Td className="whitespace-nowrap font-mono text-xs text-slate-500">
                        {row.clickup_task_id}
                      </Td>
                      <Td>{row.phase}</Td>
                      <Td>
                        <StatusBadge status={row.status} />
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </section>
      </div>

      <DetailModal open={Boolean(selectedRow)} onClose={() => setSelectedRow(null)} row={selectedRow} />
    </div>
  );
}
