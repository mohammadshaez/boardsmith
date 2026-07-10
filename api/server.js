const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db");
const dashboardRoutes = require("./routes/dashboardRoutes");
const fileRoutes = require("./routes/fileRoutes");
const { healthCheck } = require("./controllers/healthController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", healthCheck);
app.use("/api", dashboardRoutes);
app.use("/api", fileRoutes);

app.listen(PORT, async () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  await initializeDatabase();
});
