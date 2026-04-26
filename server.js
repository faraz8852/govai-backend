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

app.post("/run-task", (req, res) => {
  const { task, input } = req.body ?? {};

  if (!task) {
    return res.status(400).json({ error: "task is required" });
  }

  if (task.toLowerCase().includes("pan")) {
    return res.json({
      success: true,
      message: "PAN check working (mock)",
      input: input,
    });
  }

  return res.status(400).json({ error: "Unknown task" });
});

app.listen(PORT, () => {
  console.log(`GovAI backend running on port ${PORT}`);
});
