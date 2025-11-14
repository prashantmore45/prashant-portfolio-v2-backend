const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_PATH = path.join(__dirname, "../data/projects.json");

function readProjects() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return [];
  }
}

router.get("/", (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

module.exports = router;
