import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "GovAI backend running" });
});

app.post("/run-task", async (req, res) => {
  const { task } = req.body || {};

  if (!task) {
    return res.status(400).json({ error: "Task required" });
  }

  const lowerTask = task.toLowerCase();

  // GST (regex extraction)
  if (lowerTask.includes("gst")) {
    const match = task.match(/[0-9A-Z]{15}/);
    const gst = match ? match[0] : "NOT_FOUND";
    return res.json({
      gst,
      status: "Active",
      business: "Demo Pvt Ltd",
    });
  }

  // PAN (regex extraction)
  if (lowerTask.includes("pan")) {
    const match = task.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
    const pan = match ? match[0] : "NOT_FOUND";
    return res.json({
      pan,
      status: "Valid",
      name: "Sample User",
      category: "Individual",
    });
  }

  return res.json({ message: "Task not supported yet" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
