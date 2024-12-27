import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { ConfigManager } from '../core/configManager.js';
export async function generateResource() {
    const configManager = new ConfigManager();
    const directories = configManager.getDirectories();
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'resourceName',
            message: 'Resource name (e.g. User):',
            validate: (input) => input.trim() !== '' || 'Resource name cannot be empty',
        },
        {
            type: 'list',
            name: 'resourceType',
            message: 'Generate a service or controller?',
            choices: ['service', 'controller'],
        },
    ]);
    const { resourceName, resourceType } = answers;
    // Determine the target directory based on resource type
    const targetDirKey = resourceType === 'service' ? 'services' : 'controllers';
    const targetDir = directories[targetDirKey];
    if (!targetDir) {
        console.log(chalk.red(`No directory mapping found for "${resourceType}" in the configuration.`));
        return;
    }
    const fullTargetDir = path.resolve(process.cwd(), targetDir);
    // Ensure the target directory exists
    fs.ensureDirSync(fullTargetDir);
    // Determine the file path
    const filePath = path.join(fullTargetDir, `${resourceName.toLowerCase()}.${resourceType}.ts`);
    // Generate the file content
    let fileContent = '';
    if (resourceType === 'service') {
        fileContent = `export class ${resourceName}Service {
  constructor() {
    // service constructor
  }

  // TODO: implement your ${resourceName} logic
}\n`;
    }
    else {
        fileContent = `import { Application, Request, Response } from 'express';

export function init${resourceName}Controller(app: Application) {
  app.get('/${resourceName.toLowerCase()}', (req: Request, res: Response) => {
    res.send('Hello from ${resourceName} controller!');
  });
}\n`;
    }
    // Write the file
    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`The file "${filePath}" already exists. Skipping generation.`));
    }
    else {
        fs.writeFileSync(filePath, fileContent);
        console.log(chalk.green(`Generated a new ${resourceType} at: ${filePath}`));
    }
}
