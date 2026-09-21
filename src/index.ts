import "dotenv/config";
import readline from "node:readline";
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

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Agent 已启动，输入 'exit' 退出\n");

  const askQuestion = () => {
    rl.question("你: ", async (input) => {
      if (input.trim().toLowerCase() === "exit") {
        rl.close();
        return;
      }

      const answer = await agent.run(input);
      console.log(`Agent: ${answer}\n`);
      askQuestion();
    });
  };

  rl.on("close", () => {
    process.exit(0);
  });

  askQuestion();
}

main().catch(console.error);
