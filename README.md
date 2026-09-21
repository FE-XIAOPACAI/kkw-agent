# kkw-agent

一个用于学习 Agent 的 TypeScript 项目，从零实现基于 ReAct 的智能体，并接入前端界面。

## 功能特性

- 基于 ReAct 范式的 Agent 核心
- 工具调用（calculate、search、get_weather）
- 对话记忆
- HTTP API（普通调用 + SSE 流式输出）
- Vite + React 前端聊天界面

## 技术栈

- TypeScript
- Node.js
- Express
- React
- Vite

## 安装

```bash
# 克隆仓库
git clone https://github.com/FE-XIAOPACAI/kkw-agent.git

# 进入项目目录
cd kkw-agent

# 安装后端依赖
pnpm install

# 安装前端依赖
cd frontend
pnpm install
```

## 配置

复制 `.env.example` 为 `.env`，并填入你的 API Key：

```bash
cp .env.example .env
```

编辑 `.env`：

```
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

## 使用

### 命令行模式

```bash
pnpm dev
```

### HTTP 服务模式

```bash
# 构建前端
cd frontend && pnpm build

# 构建并启动后端
cd ..
pnpm build
pnpm start
```

然后打开浏览器访问 `http://localhost:3000`。

## 项目结构

```
├── src/          # 后端代码
├── frontend/     # 前端代码
├── plans/        # 学习计划文档
├── dist/         # 后端编译输出
└── README.md
```

## 学习计划

见 [plans/learning-plan.md](./plans/learning-plan.md)。

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT
