const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    console.log("Root route hit");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <head>
          <title>Financial Sandbox Backend</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
              background-color: #f4f4f4;
              color: #333;
            }
            h1 {
              color: #0078d4;
            }
            p {
              font-size: 1.2rem;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Financial Testing Sandbox Backend</h1>
          <p>API-Ready. Secure. Monitored with Application Insights.</p>
        </body>
      </html>
    `);
  } else if (req.url === "/health") {
    console.log("Health check route hit");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date() }));
  } else {
    console.log(`Unhandled route hit: ${req.url}`);
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Backend is running and listening on port ${PORT}`);
});
