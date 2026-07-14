require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db");
const dashboardRoutes = require("./routes/dashboardRoutes");
const fileRoutes = require("./routes/fileRoutes");
const { healthCheck } = require("./controllers/healthController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://boardsmith-rose.vercel.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", healthCheck);
app.use("/api", dashboardRoutes);
app.use("/api", fileRoutes);

app.listen(PORT, async () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  await initializeDatabase();
});
