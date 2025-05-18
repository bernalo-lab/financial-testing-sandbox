import React from "react";
import "./App.css";

function App() {
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