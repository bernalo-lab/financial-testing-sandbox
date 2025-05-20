import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState(null);
  const [status, setStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [echoInput, setEchoInput] = useState('');
  const [echoResponse, setEchoResponse] = useState(null);

  useEffect(() => {
    fetch("https://sandbox-backend-bernalo.azurewebsites.net/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error("Backend not reachable:", err));

    fetch("https://sandbox-backend-bernalo.azurewebsites.net/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error("Status API failed:", err));

    fetch("https://sandbox-backend-bernalo.azurewebsites.net/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Users API failed:", err));
  }, []);

  const handleEchoSubmit = (e) => {
    e.preventDefault();
    try {
      const body = JSON.parse(echoInput);
      fetch("https://sandbox-backend-bernalo.azurewebsites.net/api/echo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(res => res.json())
        .then(data => setEchoResponse(data))
        .catch(err => setEchoResponse({ error: "Request failed" }));
    } catch {
      setEchoResponse({ error: "Invalid JSON format" });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Financial Testing Sandbox</h1>
        <p>Build. Test. Learn. Launch with Confidence.</p>
      </header>

      <section className="App-section">
        <h2>What You Can Do</h2>
        <ul>
          <li>Run automated test cases on mock banking APIs</li>
          <li>Test login flows, transaction integrity, and data validation</li>
          <li>Monitor test coverage and bug trends via App Insights</li>
          <li>Deploy in a live Azure-hosted CI/CD environment</li>
        </ul>
      </section>

      <section className="App-section">
        <h2>See It in Action</h2>
        <button onClick={() => window.location.href = "/demo"}>
          View Live Demo
        </button>
      </section>

      <section className="App-section">
        <h2>Who's This For?</h2>
        <ul>
          <li>Test Engineers practicing exploratory or automation skills</li>
          <li>Dev teams validating core banking APIs</li>
          <li>CTOs reviewing CI/CD and QA effectiveness</li>
        </ul>
      </section>

      <section className="App-section">
        <h2>Backend Health Check</h2>
        {health ? (
          <pre>{JSON.stringify(health, null, 2)}</pre>
        ) : (
          <p>Checking backend status...</p>
        )}
      </section>

      <section className="App-section">
        <h2>Backend Status</h2>
        {status ? (
          <pre>{JSON.stringify(status, null, 2)}</pre>
        ) : (
          <p>Fetching service status...</p>
        )}
      </section>

      <section className="App-section">
        <h2>Users List</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} - {user.role}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading users...</p>
        )}
      </section>

      <section className="App-section">
        <h2>Echo API Test</h2>
        <form onSubmit={handleEchoSubmit}>
          <textarea
            value={echoInput}
            onChange={(e) => setEchoInput(e.target.value)}
            rows="5"
            cols="50"
            placeholder='Type valid JSON here, e.g. { "message": "Hello" }'
          />
          <br />
          <button type="submit">Send to Backend</button>
        </form>
        {echoResponse && (
          <div>
            <h4>Response:</h4>
            <pre>{JSON.stringify(echoResponse, null, 2)}</pre>
          </div>
        )}
      </section>

      <footer className="App-footer">
        <p>Created by Bernalo Lab • Powered by Azure & GitHub Actions</p>
        <a
          href="https://github.com/bernalo-lab/financial-testing-sandbox"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository
        </a>
      </footer>
    </div>
  );
}

export default App;