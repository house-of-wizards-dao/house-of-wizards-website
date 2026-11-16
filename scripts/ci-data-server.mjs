import { createServer } from "node:http";

const news = [
  {
    id: 1,
    title: "Community news",
    text: "Updates from the Forgotten Runes community.",
    author: "@FRWCCouncil",
    date: "2026-11-01",
    highlight: true,
    status: "published",
  },
];
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end(JSON.stringify({ error: "Read-only fixture" }));
    return;
  }
  const path = new URL(request.url, "http://127.0.0.1:4319").pathname;
  response.end(
    JSON.stringify(path === "/rest/v1/cult-content-chronicle" ? news : []),
  );
});
server.listen(4319, "127.0.0.1");
