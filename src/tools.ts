export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<string> | string;
}

export const calculateTool: Tool = {
  name: "calculate",
  description: "计算数学表达式，例如 15 * 7 + 3",
  parameters: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "要计算的数学表达式",
      },
    },
    required: ["expression"],
  },
  execute: ({ expression }: { expression: string }) => {
    try {
      // 仅支持基本运算，生产环境应使用更安全的计算方式
      const result = new Function(`return (${expression})`)();
      return String(result);
    } catch (error) {
      return `计算错误: ${error}`;
    }
  },
};

export const searchTool: Tool = {
  name: "search",
  description: "模拟搜索，返回搜索结果",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "搜索关键词",
      },
    },
    required: ["query"],
  },
  execute: ({ query }: { query: string }) => {
    return `关于 "${query}" 的搜索结果：这是一个模拟搜索结果。`;
  },
};

export const getWeatherTool: Tool = {
  name: "get_weather",
  description: "获取指定城市的天气信息",
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "城市名称",
      },
    },
    required: ["city"],
  },
  execute: ({ city }: { city: string }) => {
    const weathers = ["晴", "多云", "阴", "小雨", "大雨"];
    const temperature = Math.floor(Math.random() * 30) + 10;
    const weather = weathers[Math.floor(Math.random() * weathers.length)];
    return `${city} 今天天气${weather}，气温 ${temperature}℃。`;
  },
};

export const tools: Tool[] = [calculateTool, searchTool, getWeatherTool];
