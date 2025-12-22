const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();         
connectDB();   
       
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/projects", require("./routes/projects"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/visitors", require("./routes/visitor"));
app.use("/api/resume", require("./routes/resume"));


app.use("/admin", express.static(path.join(__dirname, "admin")));

app.use("/admin-api", require("./routes/admin"));

app.get("/", (req, res) => {
  res.json({ status: "Backend API running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
