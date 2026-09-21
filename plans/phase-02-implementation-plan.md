# 第二阶段：动手实现最小 Agent（计划）

> 目标：用 TypeScript 从零实现一个可运行的 Agent，理解其内部机制。  
> 适用对象：前端开发工程师。

---

## 阶段目标

1. 搭建一个 TypeScript 项目
2. 实现一个基于 ReAct 的最小 Agent
3. 支持工具调用
4. 支持基础对话记忆
5. 通过实际运行加深理解

---

## 任务拆解

### 任务 1：初始化 TypeScript 项目

- [ ] 创建项目目录结构
- [ ] 初始化 npm 项目
- [ ] 安装 TypeScript、ts-node、@types/node
- [ ] 配置 tsconfig.json
- [ ] 添加 .gitignore
- [ ] 验证环境：运行 `npx ts-node src/index.ts`

### 任务 2：封装 LLM 调用

- [ ] 选择 LLM 接入方式（OpenAI 兼容 API）
- [ ] 创建 `src/llm.ts`
- [ ] 封装 `chat(messages)` 方法
- [ ] 支持流式输出（可选）
- [ ] 添加环境变量管理（dotenv）

### 任务 3：设计 Agent 核心

- [ ] 创建 `src/agent.ts`
- [ ] 定义 Agent 配置接口
- [ ] 实现 ReAct 循环
- [ ] 解析 LLM 的 Thought / Action / Observation
- [ ] 处理终止条件（达到 Final Answer）

### 任务 4：实现工具系统

- [ ] 创建 `src/tools.ts`
- [ ] 定义工具接口
- [ ] 实现 `calculate` 工具
- [ ] 实现 `search` 工具（模拟）
- [ ] 实现 `getWeather` 工具（模拟）
- [ ] 将工具注册到 Agent

### 任务 5：加入记忆模块

- [ ] 创建 `src/memory.ts`
- [ ] 实现对话历史存储
- [ ] 在 Agent 运行中维护上下文
- [ ] 限制历史长度，避免超出 token 限制

### 任务 6：运行与验证

- [ ] 编写入口文件 `src/index.ts`
- [ ] 运行 Agent 并观察 ReAct 循环
- [ ] 测试不同问题
- [ ] 记录运行结果和心得

---

## 项目目录结构（预期）

```
agent-learning-project/
├── plans/                      # 学习计划文档
│   ├── learning-plan.md
│   ├── phase-01-core-concepts.md
│   └── phase-02-implementation-plan.md
├── src/
│   ├── index.ts                # 入口
│   ├── agent.ts                # Agent 核心
│   ├── llm.ts                  # LLM 调用封装
│   ├── tools.ts                # 工具定义
│   └── memory.ts               # 记忆模块
├── .env                        # 环境变量（不提交）
├── .env.example                # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 技术选型

| 模块 | 技术 |
|------|------|
| 语言 | TypeScript |
| 运行时 | Node.js |
| LLM API | OpenAI 兼容 API |
| HTTP 请求 | fetch（Node 18+）或 axios |
| 环境变量 | dotenv |

---

## 验收标准

- [ ] 项目可以正常编译和运行
- [ ] Agent 能根据问题调用正确工具
- [ ] Agent 能完成多步骤推理
- [ ] 对话历史能正确维护
- [ ] 代码结构清晰，有基本注释

---

## 下一步

开始执行任务 1：初始化 TypeScript 项目。
