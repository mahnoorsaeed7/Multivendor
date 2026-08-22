import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(
          `${API_URL}/api/health`
        );

        const data = await response.json();

        setStatus(data.status);
      } catch (error) {
        console.error(error);
        setStatus("backend unavailable");
      }
    }

    checkBackend();
  }, []);

  return (
    <main>
      <h1>Multivendor Marketplace</h1>

      <p>Backend status: {status}</p>
    </main>
  );
}

export default App;