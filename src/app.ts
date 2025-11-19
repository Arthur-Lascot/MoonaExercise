import express from "express";
import mcp_routes from "./routes/mcp.routes";

const app = express();

app.use(express.json())

app.use('/mcp', mcp_routes);

export default app;