import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ConfigManager } from '../core/configManager.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleConfiguration = {
  directories: ['controller', 'service', 'route', 'model', 'repository'],
  mainEntry: 'index.ts',
};

export async function addModule(moduleName?: string) {
  const configManager = new ConfigManager();
  const directories = configManager.getDirectories();

  // Prompt the user for the module name if not provided
  if (!moduleName) {
    const answers = await inquirer.prompt<{ chosenModule: string }>([
      {
        type: 'input',
        name: 'chosenModule',
        message: 'Enter the name of the module to add (e.g., auth-jwt):',
        validate: (input) => input.trim() !== '' || 'Module name cannot be empty',
      },
    ]);
    moduleName = answers.chosenModule.trim();
  }

  let modulePath = path.resolve(__dirname, '../templates', moduleName);

  // Check if the module exists locally or fetch it from npm
  if (!fs.existsSync(modulePath)) {
    if (!moduleName.startsWith('jhipster-')) {
      moduleName = 'jhipster-' + moduleName;
    }
    console.log(chalk.blue(`Fetching "${moduleName}" from npm...`));
    try {
      await import('child_process').then((cp) => {
        cp.execSync(`npm install ${moduleName}`, { stdio: 'inherit' });
      });

      const modulePackagePath = path.resolve(
        process.cwd(),
        'node_modules',
        moduleName
      );
      modulePath = modulePackagePath;

      if (!fs.existsSync(modulePath)) {
        throw new Error(`Failed to fetch module "${moduleName}".`);
      }
    } catch (error) {
      console.error(chalk.red(`Error fetching module "${moduleName}": ${error}`));
      return;
    }
  }

  console.log(chalk.green(`Installing module "${moduleName}"...`));

  // Distribute files into mapped directories
  for (const dir of moduleConfiguration.directories) {
    const sourceDir = path.join(modulePath, dir);
    const destinationDir = path.resolve(process.cwd(), directories[dir]);

    if (fs.existsSync(sourceDir)) {
      fs.ensureDirSync(destinationDir);
      fs.copySync(sourceDir, destinationDir);
      console.log(chalk.green(`Copied "${dir}" files to ${directories[dir]}`));
    } else {
      console.log(chalk.yellow(`No "${dir}" files found in module "${moduleName}".`));
    }
  }

  // Copy the main entry point (index.ts) to the `src/modules` directory
  const moduleMainPath = path.join(modulePath, moduleConfiguration.mainEntry);
  const modulesDestination = path.resolve(process.cwd(), `src/modules/${moduleName}`);
  if (fs.existsSync(moduleMainPath)) {
    fs.ensureDirSync(modulesDestination);
    fs.copySync(moduleMainPath, path.join(modulesDestination, moduleConfiguration.mainEntry));
    console.log(chalk.green(`Copied entry point to src/modules/${moduleName}/index.ts`));
  } else {
    console.log(chalk.red(`No "index.ts" file found for module "${moduleName}".`));
  }

  // Update the project configuration
  configManager.setModule(moduleName, {
    installedAt: new Date().toISOString(),
  });

  // Install dependencies
  console.log(chalk.blue('Installing dependencies...'));
  try {
    await import('child_process').then((cp) => {
      cp.execSync(`npm install jsonwebtoken @types/jsonwebtoken`, { stdio: 'inherit' });
    });
  } catch (error) {
    console.error(chalk.red('Error installing dependencies:', error));
    return;
  }

  console.log(chalk.green(`Module "${moduleName}" installed successfully!`));
}
