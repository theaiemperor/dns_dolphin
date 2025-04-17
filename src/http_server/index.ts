import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello from Express!");
});

export default app;
