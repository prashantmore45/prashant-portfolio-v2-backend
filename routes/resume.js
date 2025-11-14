const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "../resume/Prashant_Resume.pdf");
  res.download(filePath);
});

module.exports = router;
