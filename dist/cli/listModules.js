import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function listModules() {
    const templatesPath = path.resolve(__dirname, '../templates');
    if (!fs.existsSync(templatesPath)) {
        console.log(chalk.yellow('No templates directory found.'));
        return;
    }
    const modules = fs.readdirSync(templatesPath).filter((dir) => {
        // Ensure it's a folder and has an index.ts or similar
        return fs.statSync(path.join(templatesPath, dir)).isDirectory();
    });
    if (modules.length === 0) {
        console.log(chalk.yellow('No modules available.'));
        return;
    }
    console.log(chalk.green('Available TypeScript Modules:'));
    for (const mod of modules) {
        console.log(` - ${mod}`);
    }
}
