import fs from "node:fs";
import path from "node:path";

export interface ModelConfig {
  value: string;
  label: string;
  baseURL?: string;
}

const modelsDir = path.join(__dirname, "models");

function loadModels(): ModelConfig[] {
  if (!fs.existsSync(modelsDir)) {
    return [];
  }

  return fs
    .readdirSync(modelsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const fullPath = path.join(modelsDir, file);
      const content = fs.readFileSync(fullPath, "utf-8");
      return JSON.parse(content) as ModelConfig;
    });
}

const models = loadModels();

export function getModels(): ModelConfig[] {
  return [...models];
}

export function findModel(value?: string): ModelConfig | undefined {
  if (!value) return undefined;
  return models.find((model) => model.value === value);
}
