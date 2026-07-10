const { isReady } = require("../db");

function healthCheck(_req, res) {
  res.json({ ok: true, dbReady: isReady() });
}

module.exports = {
  healthCheck,
};
