const { createPool } = require("mysql2/promise");
require("dotenv").config();

let pool;
let dbReady = false;

async function initializeDatabase() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.warn(
      "MySQL environment variables are not fully set. Backend will start in degraded mode.",
    );
    return;
  }

  try {
    const adminPool = createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
    });

    await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

    pool = createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
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
