const { isReady } = require("../db");

function ensureDb(req, res, next) {
  if (!isReady()) {
    return res.status(503).json({
      error: "Database not configured. Set MySQL environment variables first.",
    });
  }
  next();
}

module.exports = {
  ensureDb,
};
