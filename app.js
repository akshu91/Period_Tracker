const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Import user routes

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/periodTracker", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Use routes
app.use("/api/users", userRoutes);
app.get("/api/your-endpoint", (req, res) => {
  res.json({ message: "API is working!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
