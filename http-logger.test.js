import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";

const app = express();

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty"
  }
});

app.use(
  pinoHttp({
    logger
  })
);

app.get("/test", (req, res) => {
  req.log.info("Request received");

  req.log.info(
    { requestId: req.id },
    "Processing request"
  );

  req.log.info("Request processing finished");

  res.json({
    message: "Hello from test"
  });
});
app.get("/error-test", (req, res) => {
  try {
    throw new Error("Database connection failed");
  } catch (error) {
    req.log.error(
      { err: error },
      "Failed during database operation"
    );

    res.status(500).json({
      message: "Something went wrong"
    });
  }
});
app.listen(3000, () => {
  logger.info("Test server running on port 3000");
});