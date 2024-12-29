import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadTemplate(templateName: string): Promise<string> {
try {
 const templatePath = path.resolve(__dirname, `../templates/${templateName}.template.js`);
 console.log(templatePath);
 const { template } = await import(templatePath);
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