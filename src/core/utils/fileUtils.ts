import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { ResourceType, SupportedOrms } from '../resourceTypes.js';
import { getOrmTemplateName, loadTemplate, replacePlaceholders } from './templateUtils.js';

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

export function loadTemplateFile(filePath: string): string {
  try {
    const templatePath = path.resolve(__dirname, `../templates/${filePath}`);
    const template = fs.readFileSync(templatePath);
    return template.toString();
  } catch (err) {
    throw new Error(`Failed to load template: ${filePath}. Error: ${err}`);
  }
}

export async function generateResourceFile(
  resourceName: string,
  resourceType: ResourceType,
  targetDir: string,
  orm?: SupportedOrms
): Promise<void> {
  resourceName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  const templateName = orm ? getOrmTemplateName(orm) : resourceType.toLowerCase();
  const rawTemplate = await loadTemplate(templateName);
  const fileContent = replacePlaceholders(rawTemplate, resourceName);
  const fileName = `${resourceName.toLowerCase()}.${resourceType.toLowerCase()}.ts`;
  writeFileSafely(path.join(targetDir, fileName), fileContent);
}
