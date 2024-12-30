import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { getOrmTemplateName, loadTemplate, replacePlaceholders } from '../core/utils/templateUtils.js';
import { OrmType, ResourceTypes, SupportedOrms } from '../core/resourceTypes.js';
import { ensureDirectoryExists, generateResourceFile, writeFileSafely } from '../core/utils/fileUtils.js';
import { generateRepository } from '../core/utils/repositoryUtils.js';
import { generateSwaggerFromControllers } from '../core/utils/swaggerUtils.js';

export async function createMicroservice(serviceName: string): Promise<void> {
    serviceName = capitalize(serviceName);
    const targetDir = path.resolve(process.cwd(), serviceName.toLowerCase());
    ensureDirectoryExists(targetDir);

    const { orm } = await promptForOrm();

    console.log(chalk.blue(`Selected ORM: ${orm}`));

    // Define and create the folder structure
    const folders = getMicroserviceFolders();
    folders.forEach((folder) => ensureDirectoryExists(path.join(targetDir, folder)));

    // Generate core components
    const components = getMicroserviceComponents(serviceName);
    await generateComponents(components, targetDir, orm, serviceName);

    // Generate template files
    await generateTemplateFiles(serviceName, targetDir);

    console.log(chalk.green(`Microservice "${serviceName}" generated successfully in ${targetDir}.`));
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function promptForOrm(): Promise<{ orm: OrmType }> {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'orm',
            message: 'Select the ORM/DB for the microservice:',
            choices: Object.values(SupportedOrms),
        },
    ]);
}

function getMicroserviceFolders(): string[] {
    return [
        'src/controllers',
        'src/routes',
        'src/services',
        'src/models',
        'src/repositories',
        'src/dtos',
        'src/middlewares',
        'src/config',
        'src/utils',
    ];
}

function getMicroserviceComponents(serviceName: string): Array<{ type: ResourceTypes; name: string; folder: string }> {
    return [
        { type: ResourceTypes.ROUTE, name: serviceName, folder: 'src/routes' },
        { type: ResourceTypes.CONTROLLER, name: serviceName, folder: 'src/controllers' },
        { type: ResourceTypes.SERVICE, name: serviceName, folder: 'src/services' },
        { type: ResourceTypes.MODEL, name: serviceName, folder: 'src/models' },
        { type: ResourceTypes.REPOSITORY, name: serviceName, folder: 'src/repositories' },
        { type: ResourceTypes.DTO, name: serviceName, folder: 'src/dtos' },
        { type: ResourceTypes.SWAGGER, name: serviceName, folder: './' },
    ];
}

async function generateComponents(
    components: Array<{ type: ResourceTypes; name: string; folder: string }>,
    targetDir: string,
    orm: OrmType,
    serviceName: string
): Promise<void> {
    for (const component of components) {
        console.log(chalk.blue(`Generating ${component.type} for ${serviceName}...`));
        const componentDir = path.join(targetDir, component.folder);
        ensureDirectoryExists(componentDir);

        if (component.type === ResourceTypes.REPOSITORY) {
            await generateRepository(component.name, componentDir, getOrmTemplateName(orm));
        } else if (component.type === ResourceTypes.SWAGGER) {
            await generateSwaggerFromControllers(
                `${serviceName}/src/controllers`,
                `./${serviceName.toLowerCase()}/swagger.yaml`
            );
        } else {
            await generateResourceFile(
                component.name,
                component.type,
                componentDir,
                component.type === ResourceTypes.MODEL ? orm : undefined
            );
        }
    }
}

async function generateTemplateFiles(serviceName: string, targetDir: string): Promise<void> {
    const templates = ['index', 'Dockerfile', 'tsconfig', 'package', 'docker-compose'];

    for (const templateName of templates) {
        const rawTemplate = await loadTemplate(`microservice/${templateName}`);
        const fileContent = replacePlaceholders(rawTemplate, serviceName);
        const fileName = mapTemplateToFileName(templateName);
        writeFileSafely(path.join(targetDir, fileName), fileContent);
    }
}

function mapTemplateToFileName(templateName: string): string {
    switch (templateName) {
        case 'index':
            return 'src/index.ts';
        case 'package':
            return 'package.json';
        case 'tsconfig':
            return 'tsconfig.json';
        case 'docker-compose':
            return 'docker-compose.yml';
        default:
            return 'Dockerfile';
    }
}
