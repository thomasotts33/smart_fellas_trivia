import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { isHttpError } from "./http/errors.js";
import { categoriesRouter } from "./routes/categories.js";
import { healthRouter } from "./routes/health.js";
import { meRouter } from "./routes/me.js";
import { teamsRouter } from "./routes/teams.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use("/api", healthRouter);
  app.use("/api", meRouter);
  app.use("/api", teamsRouter);
  app.use("/api", categoriesRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (isHttpError(err)) {
      res.status(err.status).json({ error: err.message, details: err.details });
      return;
    }

    const message = err instanceof Error ? err.message : "Unexpected server error";
    res.status(500).json({ error: message });
  };

  app.use(errorHandler);

  return app;
}

if (process.env.NODE_ENV !== "test") {
  const app = createApp();
  app.listen(config.PORT, () => {
    console.log(`SmartFellas API listening on http://localhost:${config.PORT}`);
  });
}
