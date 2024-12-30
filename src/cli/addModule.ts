import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ConfigManager } from '../core/configManager.js';
import { generateRepository } from '../core/utils/repositoryUtils.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleConfiguration = {
  directories: ['controller', 'service', 'route', 'model', 'dto', 'repository'],
  mainEntry: 'index.ts',
  templatesDir: path.resolve(__dirname, '../templates'),
};

export async function addModule(moduleName?: string): Promise<void> {
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

  let modulePath = path.join(moduleConfiguration.templatesDir, moduleName);

  // Check if the module exists locally
  if (!fs.existsSync(modulePath)) {
    console.error(chalk.red(`Module template "${moduleName}" not found locally.`));
    return;
  }

  console.log(chalk.green(`Installing core module "${moduleName}"...`));

  // Distribute files into mapped directories
  for (const dir of moduleConfiguration.directories) {
    const sourceDir = path.join(modulePath, dir);
    const destinationDir = path.resolve(process.cwd(), directories[dir]);

    if (fs.existsSync(sourceDir) && dir !== 'repository') {
      fs.ensureDirSync(destinationDir);
      fs.copySync(sourceDir, destinationDir);
      console.log(chalk.green(`Copied "${dir}" files to ${directories[dir]}`));
    } else if(dir !== 'repository') {
      console.log(chalk.yellow(`No "${dir}" files found in module "${moduleName}".`));
    }

    // Handle repositories with repository factory generation
    if (dir === 'repository' && fs.existsSync(sourceDir)) {
      const repositoryFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.repository.template.ts'));
      for (const repoFile of repositoryFiles) {
        const basename = path.basename(repoFile, '.repository.template.ts');
        const ormName = basename.split('-')[0];
        const resourceName = basename.split('-')[1];
        const targetDir = directories.repository;
        await generateRepository(resourceName, targetDir, ormName);
      }
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
    console.log(chalk.red(`No "${moduleConfiguration.mainEntry}" file found for module "${moduleName}".`));
  }

  // Update the project configuration
  configManager.setModule(moduleName, {
    installedAt: new Date().toISOString(),
  });

  console.log(chalk.blue('Installing dependencies...'));
  try {
    await installDependencies();
  } catch (error) {
    console.error(chalk.red('Error installing dependencies:', error));
    return;
  }

  console.log(chalk.green(`Module "${moduleName}" installed successfully!`));
}

/**
 * Installs dependencies required for the module.
 */
async function installDependencies(): Promise<void> {
  await import('child_process').then((cp) => {
    cp.execSync(`npm install jsonwebtoken @types/jsonwebtoken`, { stdio: 'inherit' });
  });
}
