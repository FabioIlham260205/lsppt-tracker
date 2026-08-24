export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-800">Submit LSPPT</h1>
        <p className="mt-2 text-slate-500">
          Halaman ini akan diisi form Submit LSPPT (tugas Fabio).
        </p>
        <a
          href="/history"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Lihat History
        </a>
      </div>
    </div>
  );
}
