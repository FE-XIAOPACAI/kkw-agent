# 第三阶段：前端结合与实际应用（总结）

> 目标：把 Agent 能力应用到前端开发和用户界面中。

---

## 完成内容

### 1. 后端 HTTP API

- 使用 Express 搭建 HTTP 服务
- 暴露两个接口：
  - `POST /chat`：普通调用，返回 Agent 最终答案
  - `GET /chat/stream`：SSE 流式调用，返回 Agent 执行过程
- 支持按 `sessionId` 隔离不同会话
- 支持静态文件服务，可直接访问前端页面

### 2. SSE 流式输出

- 后端通过 SSE 推送事件类型：
  - `thought`：Agent 的思考过程
  - `action`：Agent 调用的工具
  - `observation`：工具返回的结果
  - `answer`：最终答案
  - `[DONE]`：流结束标记

### 3. 前端对话界面

- 使用 Vite + React + TypeScript 构建
- 实现聊天界面：
  - 消息列表
  - 输入框
  - 发送按钮
  - 加载状态
- 通过 EventSource 接收 SSE 流
- 展示 Agent 的执行步骤

### 4. 项目结构

```
agent-learning-project/
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
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── App.css
│       └── components/
│           ├── ChatMessage.tsx
│           └── ChatInput.tsx
├── dist/                       # 后端编译输出
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 运行方式

### 1. 安装依赖

```bash
# 后端
pnpm install

# 前端
cd frontend
pnpm install
```

### 2. 构建前端

```bash
cd frontend
pnpm build
```

### 3. 构建并启动后端

```bash
cd /Users/fe_mbp13/Documents/code/kkw-agent.worktrees/agent-learning-project
pnpm build
pnpm start
```

### 4. 访问

打开浏览器访问：`http://localhost:3000`

---

## 已知限制

- 当前沙箱环境禁止端口监听，无法在沙箱内启动 HTTP 服务进行浏览器验证
- 需要在本地非沙箱环境运行 `pnpm start` 后访问

---

## 下一步

进入第四阶段：进阶与项目实战，例如：
- 多 Agent 协作
- RAG + Agent
- 部署与监控
