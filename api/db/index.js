const { createPool } = require("mysql2/promise");
require("dotenv").config();

let pool;
let dbReady = false;

async function initializeDatabase() {
  const DB_HOST = process.env.DB_HOST || process.env.MYSQLHOST || "localhost";
  const DB_USER = process.env.DB_USER || process.env.MYSQLUSER || "root";
  const DB_PASSWORD =
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "";
  const DB_NAME =
    process.env.DB_NAME || process.env.MYSQLDATABASE || "dashboard_app";
  const DB_PORT = process.env.DB_PORT || process.env.MYSQLPORT || 3306 || 3000;

  try {
    const adminPool = createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Creating database only for local MySQL
    // Railway already gives you an existing database
    if (DB_HOST === "localhost") {
      await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    }

    pool = createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        elements JSON NOT NULL,
        canvas JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    dbReady = true;
    console.log("MySQL database initialized successfully.");
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
}

function getPool() {
  return pool;
}

function isReady() {
  return dbReady;
}

module.exports = {
  initializeDatabase,
  getPool,
  isReady,
};
