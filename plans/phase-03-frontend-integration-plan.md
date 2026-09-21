# 第三阶段：前端结合与实际应用（计划）

> 目标：把 Agent 能力应用到前端开发和用户界面中。  
> 适用对象：前端开发工程师。

---

## 阶段目标

1. 理解前端如何与 Agent 交互
2. 为 Agent 添加 HTTP API 接口
3. 实现流式输出（SSE）
4. 构建一个简单的前端对话界面
5. 将 Agent 能力可视化

---

## 任务拆解

### 任务 1：为 Agent 添加 HTTP API

- [ ] 选择后端框架（Express / Fastify / Hono）
- [ ] 创建 `src/server.ts`
- [ ] 暴露 `/chat` 接口，接收用户消息，返回 Agent 回复
- [ ] 支持 CORS，允许前端访问
- [ ] 测试接口

### 任务 2：实现流式输出（SSE）

- [ ] 了解 SSE（Server-Sent Events）原理
- [ ] 修改 LLM 调用，支持流式响应
- [ ] 修改 `/chat` 接口，使用 SSE 返回流式数据
- [ ] 前端接收并展示流式内容

### 任务 3：构建前端对话界面

- [ ] 选择前端技术栈（Vite + React + TypeScript）
- [ ] 创建 `frontend/` 目录
- [ ] 实现聊天界面组件
- [ ] 调用后端 `/chat` 接口
- [ ] 展示 Agent 思考过程、工具调用、最终答案

### 任务 4：可视化 Agent 执行过程

- [ ] 展示 Thought / Action / Observation
- [ ] 展示工具调用状态
- [ ] 展示错误和重试

### 任务 5：AI 辅助编程小工具

- [ ] 实现一个代码生成/解释的小工具
- [ ] 前端输入需求，Agent 生成代码
- [ ] 展示生成的代码

---

## 技术选型

| 模块 | 技术 |
|------|------|
| 后端框架 | Express |
| 流式协议 | SSE |
| 前端框架 | React + Vite |
| HTTP 请求 | fetch |
| 样式 | 原生 CSS 或 Tailwind CSS |

---

## 项目目录结构（预期）

```
agent-learning-project/
├── plans/                      # 学习计划文档
├── src/                        # 后端代码
│   ├── index.ts                # 命令行入口
│   ├── server.ts               # HTTP 服务入口
│   ├── agent.ts                # Agent 核心
│   ├── llm.ts                  # LLM 调用封装
│   ├── tools.ts                # 工具定义
│   ├── memory.ts               # 记忆模块
│   └── test-memory.ts          # 测试脚本
├── frontend/                   # 前端代码
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── components/
│   └── vite.config.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 验收标准

- [ ] 后端 `/chat` 接口可以正常返回 Agent 回复
- [ ] 前端可以输入问题并看到回复
- [ ] 流式输出能逐字显示
- [ ] 能展示 Agent 的思考过程和工具调用
- [ ] 代码结构清晰，有基本注释

---

## 下一步

开始执行任务 1：为 Agent 添加 HTTP API。
