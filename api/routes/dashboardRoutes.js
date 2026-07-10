const express = require("express");
const { ensureDb } = require("../middleware/ensureDb");
const {
  getDashboards,
  createDashboard,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/dashboards", ensureDb, getDashboards);
router.post("/dashboards", ensureDb, createDashboard);
router.get("/dashboards/:id", ensureDb, getDashboardById);
router.put("/dashboards/:id", ensureDb, updateDashboard);
router.delete("/dashboards/:id", ensureDb, deleteDashboard);

module.exports = router;
