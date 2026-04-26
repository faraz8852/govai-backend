import express from "express";

const app  = express();
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

  // GST
  if (lowerTask.startsWith("check gst")) {
    const gst = task.split(" ").pop();
    return res.json({
      gst,
      status: "Active",
      business: "Demo Pvt Ltd",
    });
  }

  // PAN
  if (lowerTask.startsWith("check pan")) {
    const pan = task.split(" ").pop();
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
  console.log(`GovAI backend running on port ${PORT}`);
});
