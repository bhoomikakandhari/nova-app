require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req,res)=>{
    res.json({status: "NOVA API is running"});
});

const PORT = process.env.PORT || 4000;

const path = require("path");
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/{*splat}",(req,res)=>{
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, ()=>{
    console.log(`NOVA backend is listening on http://localhost:${PORT}`);
});