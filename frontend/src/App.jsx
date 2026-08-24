const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>LSPPT Tracker</h1>
      <p>Frontend berjalan. API URL: <code>{API_URL}</code></p>
      <p>
        Cek backend: <a href={API_URL} target="_blank" rel="noreferrer">{API_URL}</a>
      </p>
    </div>
  );
}

export default App;
