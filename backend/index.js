const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// ✅ Add CORS headers for frontend access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("Welcome to the Sandbox Backend!");
});

app.get("/health", (req, res) => {
  console.log("Health route hit");
  res.json({ status: "ok", timestamp: new Date() });
});

// Fallback for undefined routes
app.use((req, res) => {
  console.log(`Unhandled route: ${req.url}`);
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
});
"// trigger redeploy" 
