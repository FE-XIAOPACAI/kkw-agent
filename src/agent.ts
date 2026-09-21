import { LLM, Message } from "./llm";
import { Tool } from "./tools";
import { Memory } from "./memory";

export interface AgentConfig {
  llm: LLM;
  tools: Tool[];
  memory: Memory;
  maxIterations?: number;
}

interface ParsedOutput {
  thought?: string;
  action?: string;
  actionInput?: string;
  finalAnswer?: string;
}

export class Agent {
  private llm: LLM;
  private tools: Map<string, Tool>;
  private memory: Memory;
  private maxIterations: number;

  constructor(config: AgentConfig) {
    this.llm = config.llm;
    this.memory = config.memory;
    this.maxIterations = config.maxIterations ?? 10;
    this.tools = new Map(config.tools.map((tool) => [tool.name, tool]));
  }

  async run(input: string): Promise<string> {
    this.memory.add({ role: "user", content: input });

    for (let i = 0; i < this.maxIterations; i++) {
      const messages = this.buildMessages();
      const response = await this.llm.chat(messages);

      const parsed = this.parseLLMOutput(response);

      if (parsed.finalAnswer) {
        this.memory.add({ role: "assistant", content: parsed.finalAnswer });
        return parsed.finalAnswer;
      }

      if (parsed.action) {
        const observation = await this.executeTool(parsed.action, parsed.actionInput);
        this.memory.add({ role: "assistant", content: `Observation: ${observation}` });
      }
    }

    return "超过最大迭代次数，未能完成任务。";
  }

  async *runStream(input: string): AsyncGenerator<{ type: "thought" | "action" | "observation" | "answer"; content: string }> {
    this.memory.add({ role: "user", content: input });

    for (let i = 0; i < this.maxIterations; i++) {
      const messages = this.buildMessages();
      const response = await this.llm.chat(messages);

      const parsed = this.parseLLMOutput(response);

      if (parsed.thought) {
        yield { type: "thought", content: parsed.thought };
      }

      if (parsed.finalAnswer) {
        this.memory.add({ role: "assistant", content: parsed.finalAnswer });
        yield { type: "answer", content: parsed.finalAnswer };
        return;
      }

      if (parsed.action) {
        yield { type: "action", content: `${parsed.action}(${parsed.actionInput ?? ""})` };
        const observation = await this.executeTool(parsed.action, parsed.actionInput);
        this.memory.add({ role: "assistant", content: `Observation: ${observation}` });
        yield { type: "observation", content: observation };
      }
    }

    yield { type: "answer", content: "超过最大迭代次数，未能完成任务。" };
  }

  private buildMessages(): Message[] {
    const systemPrompt = this.buildSystemPrompt();
    const history = this.memory.getMessages();

    return [{ role: "system", content: systemPrompt }, ...history];
  }

  private buildSystemPrompt(): string {
    const toolDescriptions = Array.from(this.tools.values())
      .map((tool) => `- ${tool.name}: ${tool.description}`)
      .join("\n");

    return `你是一个智能助手，可以使用以下工具完成任务：

${toolDescriptions}

请严格按照以下两种格式之一输出，每个部分必须单独一行：

格式 1 - 需要调用工具时：
Thought: 你的思考过程
Action: 工具名称
Action Input: 工具参数（JSON 格式）

格式 2 - 已经得到答案或可以直接回答时：
Final Answer: 最终答案

重要规则：
- 每次只能输出一个 Action
- Action Input 必须是合法的 JSON，且独占一行
- Thought、Action、Action Input、Final Answer 每个部分必须单独一行
- 调用工具得到 Observation 后，如果已经能回答用户问题，必须立即输出 Final Answer
- 不要对同一个工具重复调用超过一次
- 如果可以直接回答，必须输出 Final Answer，不要输出 Thought/Action
- 绝对不要重复输出同一个答案多次`;
  }

  private parseLLMOutput(output: string): ParsedOutput {
    const thoughtMatch = output.match(/Thought:\s*(.*)/m);
    const actionMatch = output.match(/Action:\s*(\w+)/m);
    const actionInputMatch = output.match(/Action Input:\s*(.*)/m);
    const finalAnswerMatch = output.match(/Final Answer:\s*(.*)/m);

    if (finalAnswerMatch) {
      return { finalAnswer: finalAnswerMatch[1].trim() };
    }

    // 如果 LLM 没有输出 Final Answer，也没有 Action，则把整个输出当作最终答案
    if (!actionMatch) {
      return { finalAnswer: output.trim() };
    }

    const result: ParsedOutput = {};

    if (thoughtMatch) {
      result.thought = thoughtMatch[1].trim();
    }

    if (actionMatch) {
      result.action = actionMatch[1].trim();
    }

    if (actionInputMatch) {
      result.actionInput = actionInputMatch[1].trim();
    }

    return result;
  }

  private async executeTool(action: string, actionInput?: string): Promise<string> {
    const tool = this.tools.get(action);

    if (!tool) {
      return `错误：找不到工具 "${action}"`;
    }

    let args: any;
    try {
      args = actionInput ? JSON.parse(actionInput) : {};
    } catch {
      return `错误：Action Input 不是合法的 JSON`;
    }

    try {
      return await tool.execute(args);
    } catch (error) {
      return `工具执行错误: ${error}`;
    }
  }
}
