import "dotenv/config";
import path from "node:path";
import express from "express";
import cors from "cors";
import { LLM } from "./llm";
import { Agent } from "./agent";
import { Memory } from "./memory";
import { tools } from "./tools";
import { getModels, findModel } from "./modelRegistry";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const apiKey = process.env.OPENAI_API_KEY!;

if (!apiKey) {
  console.error("请设置 OPENAI_API_KEY 环境变量");
  process.exit(1);
}

// 每个会话一份共享记忆，切换模型不丢历史
const memories = new Map<string, Memory>();
// 每个会话+模型一个 Agent（迭代状态隔离），但共享同一会话记忆
const agents = new Map<string, Agent>();

function createLLM(model?: string): LLM {
  const config = findModel(model);
  return new LLM({
    apiKey,
    baseURL: config?.baseURL ?? process.env.OPENAI_BASE_URL,
    model: config?.value ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  });
}

function getMemory(sessionId: string): Memory {
  if (!memories.has(sessionId)) {
    memories.set(sessionId, new Memory());
  }
  return memories.get(sessionId)!;
}

function getAgent(sessionId: string, model?: string): Agent {
  const key = `${sessionId}:${model ?? "default"}`;
  if (!agents.has(key)) {
    agents.set(
      key,
      new Agent({
        llm: createLLM(model),
        tools,
        memory: getMemory(sessionId),
        maxIterations: 10,
      })
    );
  }
  return agents.get(key)!;
}

app.get("/models", (_req, res) => {
  res.json(getModels());
});

app.post("/chat", async (req, res) => {
  const { sessionId = "default", message, model } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message 不能为空" });
    return;
  }

  try {
    const agent = getAgent(sessionId, model);
    const answer = await agent.run(message);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.get("/chat/stream", async (req, res) => {
  const sessionId = (req.query.sessionId as string) ?? "default";
  const message = req.query.message as string;
  const model = req.query.model as string | undefined;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message 不能为空" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const agent = getAgent(sessionId, model);
    for await (const event of agent.runStream(message)) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ type: "error", content: String(error) })}\n\n`);
    res.end();
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Agent 服务已启动，http://localhost:${PORT}`);
});
