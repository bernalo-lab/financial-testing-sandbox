const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Parse JSON body

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 🔹 New Routes
app.get("/api/status", (req, res) => {
  res.json({ service: "sandbox-backend", uptime: process.uptime() });
});

const users = [
  { id: 1, name: "Ada Lovelace", role: "Admin" },
  { id: 2, name: "Grace Hopper", role: "Tester" },
  { id: 3, name: "Alan Turing", role: "Dev" }
];

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/api/echo", (req, res) => {
  res.json({ received: req.body });
});

// Fallback for 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Sandbox backend running on port ${PORT}`);
});