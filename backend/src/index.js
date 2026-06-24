require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT || 3000;
const frontendDistPath = path.join(__dirname, "../../frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

// Middleware
app.use(express.json());

// API routes
app.use("/user", userRoutes);
app.use("/programs", require("./routes/programRoutes"));
app.use("/roadmaps", require("./routes/roadmapRoutes"));

app.use(["/user", "/programs", "/roadmaps"], (req, res) => {
  res.status(404).json({ success: false, message: "요청한 API를 찾을 수 없습니다." });
});

// Frontend
if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
} else {
  console.warn(
    "Frontend build not found. Run `npm run build` in the frontend folder before starting the backend."
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
