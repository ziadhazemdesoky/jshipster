import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { loadTemplate, replacePlaceholders } from '../core/utils/templateUtils.js';
import { OrmType, RESOURCE_TYPES, ResourceType, SUPPORTED_ORMS } from '../core/resourceTypes.js';
import { ensureDirectoryExists, writeFileSafely } from '../core/utils/fileUtils.js';
import { generateRepositoryFactory } from '../core/utils/repositoryUtils.js';

export async function createMicroservice(serviceName: string): Promise<void> {
    serviceName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    const targetDir = path.join(process.cwd(), serviceName.toLowerCase());
    ensureDirectoryExists(targetDir);

    const { orm } = await inquirer.prompt<{ orm: OrmType }>([
        {
            type: 'list',
            name: 'orm',
            message: 'Select the ORM/DB for the microservice:',
            choices: Object.values(SUPPORTED_ORMS),
        },
    ]);

    console.log(chalk.blue(`Selected ORM: ${orm}`));

    // Define the folder structure
    const folders = [
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

    // Create folders
    folders.forEach((folder) => ensureDirectoryExists(path.join(targetDir, folder)));

    // Generate core components
    const components = [
        { type: RESOURCE_TYPES.ROUTE, name: `${serviceName}`, folder: 'src/routes' },
        { type: RESOURCE_TYPES.CONTROLLER, name: `${serviceName}`, folder: 'src/controllers' },
        { type: RESOURCE_TYPES.SERVICE, name: `${serviceName}`, folder: 'src/services' },
        { type: RESOURCE_TYPES.MODEL, name: `${serviceName}`, folder: 'src/models' },
        { type: RESOURCE_TYPES.REPOSITORY, name: `${serviceName}`, folder: 'src/repositories' },
        { type: RESOURCE_TYPES.DTO, name: `${serviceName}`, folder: 'src/dtos' },
    ];

    for (const component of components) {
        console.log(chalk.blue(`Generating ${component.type} for ${serviceName}...`));
        const componentDir = path.join(targetDir, component.folder);
        ensureDirectoryExists(componentDir);
        if (component.type === RESOURCE_TYPES.REPOSITORY) {
            await generateRepository(component.name, componentDir, orm);
            generateRepositoryFactory(componentDir);
        }
        else {
            await generateResourceFile(
                component.name,
                component.type,
                component.type === RESOURCE_TYPES.MODEL ? orm : undefined,
                componentDir
            );
        }
    }

    const templates = ['index', 'Dockerfile', 'tsconfig', 'package'];
    for (const templateName of templates) {
        const rawTemplate = await loadTemplate(`microservice/${templateName}`);
        const fileContent = replacePlaceholders(rawTemplate, serviceName);
        const fileName =
            templateName === 'index'
                ? 'src/index.ts'
                : templateName === 'package'
                    ? 'package.json'
                    : templateName === 'tsconfig'
                        ? 'tsconfig.json'
                        : 'Dockerfile';
        writeFileSafely(path.join(targetDir, fileName), fileContent);
    }

    console.log(chalk.green(`Microservice "${serviceName}" generated successfully in ${targetDir}.`));
}

async function generateResourceFile(
    resourceName: string,
    resourceType: ResourceType,
    orm: OrmType | undefined,
    targetDir: string
) {
    const templateName = getTemplateName(resourceType, orm);
    const rawTemplate = await loadTemplate(templateName);
    const fileContent = replacePlaceholders(rawTemplate, resourceName);
    const fileName = `${resourceName.toLowerCase()}.${resourceType}.ts`;
    writeFileSafely(path.join(targetDir, fileName), fileContent);
}

function getTemplateName(resourceType: ResourceType, orm?: OrmType): string {
    const modelTemplates: Record<OrmType, string> = {
        [SUPPORTED_ORMS.MONGOOSE]: 'mongoose',
        [SUPPORTED_ORMS.SEQUELIZE]: 'sequelize',
        [SUPPORTED_ORMS.GENERIC]: 'generic-model',
    };

    if (resourceType === RESOURCE_TYPES.MODEL) {
        return modelTemplates[orm!] || 'generic-model';
    }

    const templates: Record<ResourceType, string> = {
        [RESOURCE_TYPES.SERVICE]: 'service',
        [RESOURCE_TYPES.CONTROLLER]: 'controller',
        [RESOURCE_TYPES.ROUTE]: 'route',
        [RESOURCE_TYPES.REPOSITORY]: `${orm?.split(' ')[0]}-repository`,
        [RESOURCE_TYPES.DTO]: 'dto',
        [RESOURCE_TYPES.MODEL]: 'model',
        [RESOURCE_TYPES.TSCONFIG]: 'tsconfig',
        [RESOURCE_TYPES.MICROSERVICE]: 'microservice',
    };

    return templates[resourceType] || '';
}

async function generateRepository(resourceName: string, targetDir: string, repository?: OrmType) {
    // Check if repository interface file exists 
    if (!fs.existsSync(path.join(targetDir, 'repository.interface.ts'))) {
        console.log(chalk.yellow(`Repository interface file already exists already, skipping interface creation...`));
        const repositoryInterfaceTemplate = await loadTemplate('repository-interface');
        const repositoryInterface = replacePlaceholders(repositoryInterfaceTemplate, resourceName);
        writeFileSafely(path.join(targetDir, 'repository.interface.ts'), repositoryInterface);
    }

    if (repository) {
        const templateName = getTemplateName(RESOURCE_TYPES.REPOSITORY, repository);
        const repositoryTemplate = await loadTemplate(templateName);
        const repositoryContent = replacePlaceholders(repositoryTemplate, resourceName);
        const repositoryFilePath = path.join(targetDir, `${resourceName.toLowerCase()}.repository.ts`);
        writeFileSafely(repositoryFilePath, repositoryContent);
        generateRepositoryFactory(targetDir);
    } else {
        console.log(chalk.yellow(`Generic repository support is not implemented.`));
    }
}