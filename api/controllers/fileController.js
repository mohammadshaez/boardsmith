const path = require("path");
const fs = require("fs");
const { UPLOAD_DIR } = require("../middleware/upload");

function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const id = path.basename(req.file.path);
  res.json({ id });
}

function getFile(req, res) {
  const filePath = path.join(UPLOAD_DIR, req.params.id);
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
  res.sendFile(filePath);
}

module.exports = {
  uploadFile,
  getFile,
};
