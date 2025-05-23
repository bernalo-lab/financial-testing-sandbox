
import React, { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState('Checking backend status...');
  const [users, setUsers] = useState([]);
  const backendUrl = 'https://sandbox-backend-bernalo.azurewebsites.net';

  useEffect(() => {
  const checkHealth = async () => {
    try {
      const res = await fetch(`${backendUrl}/health`);
      const data = await res.json(); // expects JSON: { status: 'OK' }
      setHealth(`Status: ${data.status}`);
    } catch (error) {
      console.error('Backend not reachable:', error);
      setHealth('Backend not reachable');
    }
  };

  checkHealth();
  }, []);


    const fetchUsers = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/users`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('User fetch failed:', error);
      }
    };

    checkHealth();
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Financial Testing Sandbox</h1>
      <h2>Backend Health Check</h2>
      <p>{health}</p>

      <h2>Users List</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
