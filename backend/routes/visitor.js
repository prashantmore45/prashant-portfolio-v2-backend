const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const FILE_PATH = path.join(__dirname, "../data/visitors.json");

function readVisitors() {
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  } catch {
    return { total: 0 };
  }
}

router.post("/add", (req, res) => {
  let data = readVisitors();
  data.total += 1;

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json({ total: data.total });
});

router.get("/", (req, res) => {
  res.json(readVisitors());
});

module.exports = router;
