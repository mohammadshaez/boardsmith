const { getPool } = require("../db");
const { parseJson } = require("../utils/parseJson");

async function getDashboards(_req, res) {
  const [rows] = await getPool().query(
    "SELECT * FROM dashboards ORDER BY id DESC",
  );
  res.json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      elements: parseJson(row.elements, []),
      canvas: parseJson(row.canvas, {
        width: 1200,
        height: 800,
        bg: "#FFFFFF",
      }),
    })),
  );
}

async function createDashboard(req, res) {
  const {
    name = "Untitled Dashboard",
    elements = [],
    canvas = { width: 1200, height: 800, bg: "#FFFFFF" },
  } = req.body;
  const [result] = await getPool().query(
    "INSERT INTO dashboards (name, elements, canvas) VALUES (?, ?, ?)",
    [name, JSON.stringify(elements), JSON.stringify(canvas)],
  );
  res.status(201).json({ id: result.insertId, name, elements, canvas });
}

async function getDashboardById(req, res) {
  const [rows] = await getPool().query(
    "SELECT * FROM dashboards WHERE id = ?",
    [req.params.id],
  );

  if (!rows.length)
    return res.status(404).json({ error: "Dashboard not found" });

  const row = rows[0];
  res.json({
    id: row.id,
    name: row.name,
    elements: parseJson(row.elements, []),
    canvas: parseJson(row.canvas, { width: 1200, height: 800, bg: "#FFFFFF" }),
  });
}

async function updateDashboard(req, res) {
  const { name, elements, canvas } = req.body;
  await getPool().query(
    "UPDATE dashboards SET name = ?, elements = ?, canvas = ? WHERE id = ?",
    [name, JSON.stringify(elements), JSON.stringify(canvas), req.params.id],
  );
  res.json({ ok: true });
}

async function deleteDashboard(req, res) {
  await getPool().query("DELETE FROM dashboards WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
}

module.exports = {
  getDashboards,
  createDashboard,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
};
