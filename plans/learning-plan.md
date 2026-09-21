# Agent 学习计划

> 适用对象：前端开发工程师  
> 学习路径：先理解原理，再动手写代码，最后结合前端场景实战。

---

## 第一阶段：建立基础概念（1-2 周）

### 目标
理解 Agent 是什么，以及它和传统 LLM 应用的区别。

### 学习内容
1. **什么是 Agent**
   - Agent = LLM + 规划 + 记忆 + 工具
   - 与普通 Chatbot 的区别：能自主决策、调用工具、完成任务
2. **核心组件**
   - 大模型（LLM）
   - Prompt 工程
   - 工具调用（Function Calling / Tool Use）
   - 记忆（Memory）
   - 规划与推理（ReAct、CoT 等）
3. **经典范式**
   - ReAct：Thought → Action → Observation
   - Plan-and-Execute：先规划，再执行
   - Reflexion：自我反思与修正

### 推荐资料
- OpenAI Function Calling 官方文档
- LangChain / LlamaIndex 入门概念
- 吴恩达《AI Agent 入门》短课

---

## 第二阶段：动手实现最小 Agent（2-3 周）

### 目标
用 TypeScript 从零实现一个可运行的 Agent，理解其内部机制。

### 学习内容
1. **搭建 TypeScript 项目**
   - 初始化 npm 项目
   - 配置 tsconfig、eslint、prettier
   - 封装 LLM 调用（OpenAI / 兼容 API）
2. **实现 ReAct Agent**
   - 设计 Agent 循环
   - 实现 Thought、Action、Observation 流程
   - 添加简单工具：计算器、天气查询、搜索
3. **加入记忆模块**
   - 短期记忆：对话历史
   - 长期记忆：向量数据库 / 简单文件存储
4. **加入规划能力**
   - 任务拆解
   - 多步骤执行与状态管理

### 产出
- 一个可运行的 TypeScript Agent
- 支持工具调用和基础记忆

---

## 第三阶段：前端结合与实际应用（2-3 周）

### 目标
把 Agent 能力应用到前端开发和用户界面中。

### 学习内容
1. **前端与 Agent 交互**
   - 流式输出：SSE / WebSocket
   - 构建 Agent 聊天界面
   - 工具执行结果的可视化
2. **AI 辅助编程场景**
   - 代码生成 Agent
   - 代码审查 Agent
   - 与 VS Code 插件结合
3. **智能组件**
   - 表单自动填充
   - 智能搜索与推荐
   - 自然语言驱动的 UI

### 产出
- 一个简单的前端 Agent 对话界面
- 一个 AI 辅助编程的小工具

---

## 第四阶段：进阶与项目实战（持续）

### 目标
掌握更复杂的 Agent 系统设计与落地能力。

### 学习内容
1. **多 Agent 协作**
   - 角色分工
   - 任务调度与通信
2. **RAG + Agent**
   - 文档问答
   - 知识库助手
3. **部署与监控**
   - 日志、追踪、评估
   - 成本与性能优化
   - 错误处理与安全边界

### 产出
- 一个具备 RAG 能力的知识库 Agent
- 完整的项目文档与运行说明

---

## 学习建议

- 每天投入 1-2 小时，保持连续性。
- 每完成一个阶段，写一个总结笔记。
- 多动手，少停留在理论。
- 遇到问题时，优先阅读官方文档和源码。

---

## 下一步

进入第一阶段：阅读核心概念资料，并尝试回答以下问题：
1. Agent 和普通 LLM 应用的最大区别是什么？
2. ReAct 循环的三个核心步骤是什么？
3. 工具调用（Function Calling）在 Agent 中起什么作用？
