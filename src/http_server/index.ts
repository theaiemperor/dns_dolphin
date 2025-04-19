import express from "express";
import {
  addServer,
  deleteServer,
  listServers,
  updateServers,
} from "./controllers";

const app = express();

// middlewares
app.use(express.json());
app.use(express.static("assets"));
app.use(express.static("src/client"));

// Routes
app.get("/api", listServers);
app.post("/api", addServer);
app.put("/api/:id", updateServers);
app.delete("/api/:id", deleteServer);

export default app;
