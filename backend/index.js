const appInsights = require("applicationinsights");
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(\`
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
    \`);
  } else if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});