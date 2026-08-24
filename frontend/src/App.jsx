import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SubmitPage from './pages/SubmitPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import ComponentsPage from './pages/ComponentsPage.jsx';
import { ToastProvider } from './components/ui';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="mt-2 text-slate-500">Halaman tidak ditemukan</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/submit" replace />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
