import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
  Badge,
  ToastProvider,
  useToast,
  Loading,
  EmptyState,
} from '../components/ui';

const PHASES = ['TS', 'QA'];
const STATUSES = {
  TS: ['Completed', 'Documentation', 'On Hold', 'In Progress', 'Plan'],
  QA: [
    'Completed',
    'Completed Testing',
    'Completed with Feedback',
    'Testing',
    'On Queue Testing',
    'Plan',
  ],
};

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

function DemoContent() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [phase, setPhase] = useState('');
  const [form, setForm] = useState({ title: '', url: '', date: '' });
  const [saving, setSaving] = useState(false);

  const statusVariant = {
    Completed: 'success',
    'In Progress': 'info',
    Testing: 'warning',
    'On Hold': 'danger',
    Plan: 'neutral',
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">UI Components</h1>
            <p className="text-sm text-slate-500">
              Live preview semua komponen untuk tim (Fabio &amp; Bagas).
            </p>
          </div>
          <a href="/submit" className="text-sm text-blue-600 hover:underline">
            ← Back to /submit
          </a>
        </div>

        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Input / Select / DatePicker">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Task Title"
              placeholder="e.g. Fix login bug"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Select
              label="Phase"
              placeholder="Select phase"
              options={PHASES}
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
            />
            <DatePicker
              label="Date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Input
              label="ClickUp URL"
              type="url"
              placeholder="https://app.clickup.com/t/..."
              error="Invalid URL format"
            />
          </div>
        </Section>

        <Section title="Modal">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirm Save LSPPT"
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Save</Button>
              </>
            }
          >
            <p className="text-sm text-slate-600">
              Are you sure you want to save this LSPPT entry? This action cannot be undone.
              Press ESC or click the overlay to close.
            </p>
          </Modal>
        </Section>

        <Section title="Table">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <Table>
              <THead>
                <Tr>
                  <Th>Task</Th>
                  <Th>Phase</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </Tr>
              </THead>
              <TBody>
                {[
                  { task: 'Fix login redirect', phase: 'TS', status: 'Completed', date: '2026-08-20' },
                  { task: 'Write API docs', phase: 'TS', status: 'Documentation', date: '2026-08-21' },
                  { task: 'Regression testing', phase: 'QA', status: 'Testing', date: '2026-08-22' },
                ].map((row) => (
                  <Tr key={row.task}>
                    <Td className="font-medium">{row.task}</Td>
                    <Td>{row.phase}</Td>
                    <Td>
                      <Badge variant={statusVariant[row.status] || 'neutral'}>{row.status}</Badge>
                    </Td>
                    <Td>{row.date}</Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
        </Section>

        <Section title="Badge">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Completed</Badge>
            <Badge variant="info">In Progress</Badge>
            <Badge variant="warning">Testing</Badge>
            <Badge variant="danger">On Hold</Badge>
            <Badge variant="neutral">Plan</Badge>
          </div>
        </Section>

        <Section title="Toast">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() =>
                showToast({ type: 'success', title: 'Success', message: 'LSPPT saved successfully.' })
              }
            >
              Success toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                showToast({ type: 'error', title: 'Error', message: 'Failed to save. Try again.' })
              }
            >
              Error toast
            </Button>
            <Button
              variant="outline"
              onClick={() => showToast({ type: 'info', message: 'Auto-dismiss in 4 seconds.' })}
            >
              Info toast
            </Button>
          </div>
        </Section>

        <Section title="Loading">
          <div className="flex items-center gap-6">
            <Loading size="sm" />
            <Loading size="md" />
            <Loading size="lg" />
          </div>
        </Section>

        <Section title="Empty State">
          <EmptyState
            title="No history found"
            description="Try adjusting the employee filter or date range."
            action={<Button size="sm" variant="outline">Reset filter</Button>}
          />
        </Section>

        <Section title="Mini Form Demo (Button + Toast)">
          <div className="flex max-w-md items-end gap-3">
            <div className="flex-1 space-y-3">
              <Input label="Task Title" placeholder="e.g. Fix login bug" />
              <Select
                label="Status (dynamic per Phase)"
                placeholder={phase ? 'Select status' : 'Pick a Phase first'}
                options={phase ? STATUSES[phase] : []}
                disabled={!phase}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              loading={saving}
              onClick={() => {
                setSaving(true);
                setTimeout(() => {
                  setSaving(false);
                  showToast({ type: 'success', message: 'Form submitted!' });
                }, 1200);
              }}
            >
              Submit
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <ToastProvider>
      <DemoContent />
    </ToastProvider>
  );
}
