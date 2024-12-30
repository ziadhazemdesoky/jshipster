import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { SupportedOrms } from '../resourceTypes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadTemplate(templateName: string): Promise<string> {
    try {
        // Resolve the template path
        const templatePath = path.resolve(__dirname, `../templates/${templateName}.template.js`);

        // Convert the path to a file URL for dynamic import
        const templateUrl = pathToFileURL(templatePath).href;

        // Dynamically import the template file
        const { template } = await import(templateUrl);

        return template;
    } catch (err) {
        throw new Error(`Failed to load template: ${templateName}. Error: ${err}`);
    }
}

export function replacePlaceholders(template: string, placeholder: string): string {
    let result = template;
    const placeholderRegex = new RegExp(`{{resourceName}}`, 'g');
    const lowerCasePlaceholder = new RegExp(`{{resourceName.toLowerCase\\(\\)}}`, 'g');
    result = result.replace(placeholderRegex, placeholder);
    result = result.replace(lowerCasePlaceholder, placeholder.toLowerCase());
    return result;
}

export function getOrmTemplateName(orm: SupportedOrms): string {
    const modelTemplates: Record<SupportedOrms, string> = {
      [SupportedOrms.MONGOOSE]: 'mongoose',
      [SupportedOrms.SEQUELIZE]: 'sequelize',
      [SupportedOrms.GENERIC]: 'generic-model',
    };
    return modelTemplates[orm];
  }