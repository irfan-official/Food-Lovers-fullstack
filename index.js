import express from "express";
import { config } from "dotenv";
config();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import ApiRouter from "./routes/api.routes.js";
import EmailRouter from "./routes/api.email.routes.js";
import connectDB from "./connections/mongodb.connection.js";
import cookieParser from "cookie-parser";
import allowedOrigins from "./config/allowOrigin.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 4000;

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======= API ROUTES MUST GO FIRST ========
app.use("/api/v1/", ApiRouter);
app.use("/api/v1/send/email/", EmailRouter);

// ======= SERVE FRONTEND BUILD (VITE) =======
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// ======= SPA FALLBACK - Simple 404 handler ========
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ======= ERROR HANDLER =======
app.use((err, req, res, next) => {
  console.log("Error ==> ", err.message);
  return res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ======= START SERVER =======
app.listen(port, () => {
  connectDB();
  console.log(`server started at http://localhost:${port}`);
});

export default app;
