const express = require("express");
const { ensureDb } = require("../middleware/ensureDb");
const { upload } = require("../middleware/upload");
const { uploadFile, getFile } = require("../controllers/fileController");

const router = express.Router();

router.post("/upload", ensureDb, upload.single("file"), uploadFile);
router.get("/files/:id", getFile);

module.exports = router;
