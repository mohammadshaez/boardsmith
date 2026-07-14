const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");
const { UPLOAD_DIR } = require("../middleware/upload");

async function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const ext = path.extname(req.file.originalname || "") || ".bin";
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  };

  const hasS3Config = Boolean(
    awsConfig.accessKeyId &&
    awsConfig.secretAccessKey &&
    awsConfig.region &&
    process.env.S3_BUCKET_NAME,
  );

  if (hasS3Config) {
    try {
      const s3 = new AWS.S3(awsConfig);
      await s3
        .putObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype || "application/octet-stream",
        })
        .promise();

      const signedUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Expires: 60 * 60,
      });

      return res.json({ id: key, url: signedUrl });
    } catch (err) {
      console.error("S3 upload failed", err && err.message ? err.message : err);
      return res
        .status(500)
        .json({
          error: "S3 upload failed",
          details: err && err.message ? err.message : "Unknown error",
        });
    }
  }

  const localFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const localFilePath = path.join(UPLOAD_DIR, localFileName);
  fs.writeFileSync(localFilePath, req.file.buffer);

  return res.json({ id: localFileName });
}

async function getFile(req, res) {
  const localFilePath = path.join(UPLOAD_DIR, req.params.id);
  if (fs.existsSync(localFilePath)) return res.sendFile(localFilePath);

  const hasS3Config = Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.S3_BUCKET_NAME,
  );

  if (hasS3Config) {
    const key = req.params.id.replace(/^\/+/, "");
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const signedUrl = await s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 60 * 60,
    });
    return res.redirect(signedUrl);
  }

  return res.status(404).send("File not found");
}

module.exports = {
  uploadFile,
  getFile,
};
