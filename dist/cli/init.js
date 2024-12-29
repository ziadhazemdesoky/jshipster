import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function initProject() {
    // Interactive prompts
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            default: 'my-backend'
        },
        {
            type: 'confirm',
            name: 'useExampleModule',
            message: 'Would you like to add an example auth module?',
            default: true
        }
    ]);
    const { projectName, useExampleModule } = answers;
    const projectPath = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Directory "${projectName}" already exists.`));
        return;
    }
    // Create basic structure
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'src/modules'), { recursive: true });
    // Create default config
    const configPath = path.join(projectPath, 'jshipster.config.json');
    fs.writeFileSync(configPath, JSON.stringify({
        modules: {},
        directories: {
            controllers: 'src/controllers',
            services: 'src/services',
            routes: 'src/routes',
            models: 'src/models',
            repositories: 'src/repositories'
        }
    }, null, 2));
    console.log(chalk.green(`Project "${projectName}" initialized successfully.`));
    if (useExampleModule) {
        // (Optional) copy the "auth-jwt" template
        const templatesDir = path.resolve(__dirname, '../../src/templates');
        const templateSource = path.resolve(templatesDir, 'auth-jwt');
        const templateDest = path.join(projectPath, 'src/modules/auth-jwt');
        fs.copySync(templateSource, templateDest);
        console.log(chalk.blue('Added auth-jwt module to your project.'));
    }
    console.log(chalk.green('Done!'));
    console.log('Next steps:');
    console.log(`  cd ${projectName}`);
    console.log('  npm install (if needed)');
    console.log('  jshipster list-modules');
}
