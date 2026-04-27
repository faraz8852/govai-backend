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

  if (lowerTask.startsWith("check pan")) {
    const pan = task.split(" ")[2];
    return res.json({
      type: "pan",
      steps: [
        { id: "request_details", status: "done" },
        { id: "open_portal", status: "done" },
        { id: "extract_data", status: "running" },
      ],
      result: {
        pan,
        status: "Valid",
        name: "Sample User",
        category: "Individual",
      },
    });
  }

  if (lowerTask.startsWith("check gst")) {
    const gst = task.split(" ")[2];
    return res.json({
      type: "gst",
      steps: [
        { id: "request_details", status: "done" },
        { id: "open_portal", status: "done" },
        { id: "extract_data", status: "running" },
      ],
      result: {
        gst,
        status: "Active",
      },
    });
  }

  return res.json({ message: "Task not supported yet" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
