const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/projects", require("./routes/projects"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/visitors", require("./routes/visitor"));
app.use("/api/resume", require("./routes/resume"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
