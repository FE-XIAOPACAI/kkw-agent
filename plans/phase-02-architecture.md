# 第二阶段：最小 Agent 架构设计

> 目标：明确项目模块划分、依赖关系、ReAct 循环流程、工具系统设计、LLM 调用接口。  
> 适用对象：前端开发工程师。

---

## 1. 整体架构图

```
─────────────────────────────────────────────────────────────┐
│                         User Input                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Agent                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    ReAct Loop                        │  │
│  │  ┌─────────    ┌─────────┐    ┌───────────────┐     │  │
│  │  │ Thought │ -> │ Action  │ -> │ Observation   │     │  │
│  │  │ 思考    │    │ 调用工具 │    │ 观察工具返回   │     │  │
│  │  └─────────┘    └─────────┘    └───────────────     │  │
│  │       ^________________________________________|      │  │
│  └─────────────────────────────────────────────────────┘  │
│                            │                              │
│                            ▼                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │    LLM      │    │    Tools    │    │   Memory    │   │
│  │  推理引擎    │    │  外部能力    │    │  对话历史   │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Final Answer                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 模块划分与依赖关系

```
src/
├── index.ts          # 入口：组装 Agent 并运行
├── agent.ts          # Agent 核心：ReAct 循环
├── llm.ts            # LLM 调用封装
├── tools.ts          # 工具定义与注册
└── memory.ts         # 对话历史管理
```

### 依赖关系

```
index.ts
  ├── Agent (agent.ts)
  │     ├── LLM (llm.ts)
  │     ├── Tools (tools.ts)
  │     └── Memory (memory.ts)
  └── Tools (tools.ts)
```

| 模块 | 职责 | 依赖 |
|------|------|------|
| `llm.ts` | 与 LLM 交互，发送消息，获取回复 | 无 |
| `tools.ts` | 定义工具，提供工具调用能力 | 无 |
| `memory.ts` | 存储和管理对话历史 | 无 |
| `agent.ts` | 实现 ReAct 循环，协调 LLM、工具、记忆 | LLM、Tools、Memory |
| `index.ts` | 配置并启动 Agent | Agent、Tools |

---

## 3. ReAct 循环执行流程

```
开始
  │
  ▼
用户输入问题
  │
  ▼
构造系统提示 + 历史消息
  │
  ▼
调用 LLM
  │
  ▼
解析 LLM 输出
  │
  ├── 如果是 Final Answer ──> 返回结果，结束
  │
  └── 如果是 Action ──> 调用对应工具
        │
        ▼
      获取 Observation
        │
        ▼
      将 Observation 加入上下文
        │
        
      再次调用 LLM
        │
        ▼
      循环（最多 N 次，防止死循环）
```

### LLM 输出格式约定

为了让 Agent 能解析 LLM 的输出，我们约定 LLM 必须按以下格式输出：

```text
Thought: 我需要计算 15 * 7 的结果
Action: calculate
Action Input: {"expression": "15 * 7"}
```

或终止时：

```text
Thought: 我已经得到结果，可以回答用户了
Final Answer: 15 * 7 = 105
```

---

## 4. 工具系统设计

### 4.1 工具接口

```typescript
interface Tool {
  name: string;                       // 工具名称
  description: string;                // 工具描述，帮助 LLM 选择
  parameters: Record<string, any>;    // 参数 JSON Schema
  execute: (args: any) => any;        // 执行函数
}
```

### 4.2 工具注册

```typescript
const tools: Tool[] = [
  calculateTool,
  searchTool,
  getWeatherTool,
];
```

### 4.3 工具调用流程

```
LLM 输出 Action
   │
   ▼
Agent 解析 Action 名称和参数
   │
   ▼
Agent 查找对应 Tool
   │
   ▼
Agent 调用 tool.execute(args)
   │
   ▼
Tool 返回结果
   │
   ▼
Agent 将结果作为 Observation 加入上下文
```

---

## 5. LLM 调用接口设计

### 5.1 接口定义

```typescript
interface LLMConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

class LLM {
  constructor(config: LLMConfig);

  // 非流式调用
  async chat(messages: Message[]): Promise<string>;
}
```

### 5.2 使用方式

```typescript
const llm = new LLM({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "gpt-4o-mini",
});

const response = await llm.chat([
  { role: "system", content: "你是一个助手" },
  { role: "user", content: "你好" },
]);
```

---

## 6. 记忆模块设计

### 6.1 接口定义

```typescript
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

class Memory {
  private messages: Message[] = [];

  add(message: Message): void;
  getMessages(): Message[];
  clear(): void;
}
```

### 6.2 使用方式

```typescript
const memory = new Memory();
memory.add({ role: "user", content: "你好" });
memory.add({ role: "assistant", content: "你好！有什么可以帮你的？" });
```

---

## 7. Agent 核心设计

### 7.1 配置

```typescript
interface AgentConfig {
  llm: LLM;
  tools: Tool[];
  memory: Memory;
  maxIterations?: number;
}
```

### 7.2 核心方法

```typescript
class Agent {
  constructor(config: AgentConfig);

  async run(input: string): Promise<string>;

  private buildSystemPrompt(): string;
  private parseLLMOutput(output: string): ParsedOutput;
  private executeTool(action: string, actionInput: any): Promise<string>;
}
```

### 7.3 运行流程

```typescript
async run(input: string): Promise<string> {
  this.memory.add({ role: "user", content: input });

  for (let i = 0; i < this.maxIterations; i++) {
    const messages = this.buildMessages();
    const response = await this.llm.chat(messages);

    const parsed = this.parseLLMOutput(response);

    if (parsed.finalAnswer) {
      return parsed.finalAnswer;
    }

    if (parsed.action && parsed.actionInput) {
      const observation = await this.executeTool(parsed.action, parsed.actionInput);
      this.memory.add({ role: "assistant", content: `Observation: ${observation}` });
    }
  }

  return "超过最大迭代次数";
}
```

---

## 8. 入口文件设计

```typescript
// src/index.ts
import { Agent } from "./agent";
import { LLM } from "./llm";
import { Memory } from "./memory";
import { tools } from "./tools";

async function main() {
  const llm = new LLM({
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4o-mini",
  });

  const agent = new Agent({
    llm,
    tools,
    memory: new Memory(),
  });

  const answer = await agent.run("帮我算一下 15 乘以 7 加上 3");
  console.log(answer);
}

main();
```

---

## 9. 关键设计决策

| 决策点 | 选择 | 原因 |
|--------|------|------|
| LLM 输出格式 | 文本约定格式 | 简单直观，不依赖特定模型 |
| 工具调用方式 | 同步函数调用 | 先理解同步流程，再扩展异步 |
| 记忆实现 | 内存数组 | 最小实现，后续可扩展持久化 |
| 终止条件 | Final Answer 或最大迭代次数 | 防止死循环 |
| 错误处理 | 工具执行异常返回错误信息 | 让 Agent 有机会自我修正 |

---

## 10. 下一步

确认架构后，开始实现：

1. 初始化 TypeScript 项目
2. 实现 `llm.ts`
3. 实现 `tools.ts`
4. 实现 `memory.ts`
5. 实现 `agent.ts`
6. 编写 `index.ts` 并运行
