const appInsights = require("applicationinsights");
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Backend is running and monitored by App Insights.\n");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});