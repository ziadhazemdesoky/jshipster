import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function ensureDirectoryExists(directory: string): void {
  try {
    fs.ensureDirSync(directory);
  } catch (err) {
    throw new Error(`Failed to ensure directory: ${directory}. Error: ${err}`);
  }
}

export function writeFileSafely(filePath: string, content: string): void {
  if (fs.existsSync(filePath)) {
    throw new Error(`File already exists: ${filePath}`);
  }
  fs.writeFileSync(filePath, content);
}

export function lodaTemplateFile(filePath: string): string {
try {
 const templatePath = path.resolve(__dirname, `../templates${filePath}`);
 const template = fs.readFileSync(templatePath);
 return template.toString();
} catch (err) {
 throw new Error(`Failed to load template: ${filePath}. Error: ${err}`);
}
}
