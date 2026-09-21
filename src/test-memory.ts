import "dotenv/config";
import { LLM } from "./llm";
import { Agent } from "./agent";
import { Memory } from "./memory";
import { tools } from "./tools";

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("请设置 OPENAI_API_KEY 环境变量");
    process.exit(1);
  }

  const llm = new LLM({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL,
    model: process.env.OPENAI_MODEL,
  });

  const agent = new Agent({
    llm,
    tools,
    memory: new Memory(),
    maxIterations: 10,
  });

  const questions = [
    "北京今天天气怎么样",
    "上海呢",
    "帮我算一下 15 乘以 7",
    "再加上 3",
  ];

  for (const question of questions) {
    console.log(`你: ${question}`);
    const answer = await agent.run(question);
    console.log(`Agent: ${answer}\n`);
  }
}

main().catch(console.error);
