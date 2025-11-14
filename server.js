const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "../public")));


app.use("/api/contact", require("./routes/contact"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/visitors", require("./routes/visitor"));
app.use("/api/resume", require("./routes/resume"));



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
