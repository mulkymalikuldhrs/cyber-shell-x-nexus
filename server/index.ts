import express from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware untuk logging detail
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[SERVER] ==> Request Start: ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[SERVER] <== Request End: ${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
  });

  next();
});

(async () => {
  console.log("[SERVER] Initializing...");
  const server = await registerRoutes(app);

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`[SERVER] CyberShellX server listening on http://0.0.0.0:${port}`);
  });
})();
