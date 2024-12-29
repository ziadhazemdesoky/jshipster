import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { ConfigManager } from '../core/configManager.js';
import { RESOURCE_TYPES, SUPPORTED_ORMS } from '../core/resourceTypes.js';
import { loadTemplate, replacePlaceholders } from '../core/utils/templateUtils.js';
import { ensureDirectoryExists, writeFileSafely } from '../core/utils/fileUtils.js';
import { generateRepositoryFactory } from '../core/utils/repositoryUtils.js';
export async function generateResource() {
    const configManager = new ConfigManager();
    const directories = configManager.getDirectories();
    try {
        const answers = await promptUserForResourceDetails();
        const { resourceName, resourceType, subResourceType, standaloneType, orm, repository } = answers;
        if (resourceType === RESOURCE_TYPES.FULL_MODULE && resourceName) {
            const fullTargetDir = path.resolve(process.cwd(), directories.module);
            ensureDirectoryExists(fullTargetDir);
            await generateFullModule(resourceName, fullTargetDir, orm);
        }
        else if (resourceType === 'part') {
            const targetDir = directories[subResourceType];
            console.log(subResourceType);
            if (!targetDir) {
                return logError(`No directory mapping found for "${subResourceType}" in the configuration.`);
            }
            const fullTargetDir = path.resolve(process.cwd(), targetDir);
            ensureDirectoryExists(fullTargetDir);
            if (resourceName === undefined)
                return logError(`Invalid resource name.`);
            if (subResourceType === RESOURCE_TYPES.REPOSITORY) {
                await generateRepository(resourceName, fullTargetDir, repository);
            }
            else {
                if (subResourceType === undefined)
                    return logError(`Invalid subresource name.`);
                await generateResourceFile(resourceName, subResourceType, orm, fullTargetDir);
            }
        }
        else if (resourceType === 'standalone') {
            const targetDir = directories[standaloneType.toLowerCase()];
            if (!targetDir) {
                return logError(`No directory mapping found for "${standaloneType}" in the configuration.`);
            }
            const fullTargetDir = path.resolve(process.cwd(), targetDir);
            ensureDirectoryExists(fullTargetDir);
            if (standaloneType === RESOURCE_TYPES.TSCONFIG) {
                const tsconfigTemplate = await loadTemplate('tsconfig');
                writeFileSafely(path.join(fullTargetDir, 'tsconfig.json'), tsconfigTemplate);
            }
        }
        console.log(chalk.green(`Resource generated successfully.`));
    }
    catch (error) {
        logError(error);
    }
}
async function promptUserForResourceDetails() {
    const questions = [
        {
            type: 'list',
            name: 'resourceType',
            message: 'Select the type of resource to generate:',
            choices: [
                { name: 'Full Module (service, controller, route, etc.)', value: RESOURCE_TYPES.FULL_MODULE },
                { name: 'Part of a Module (service, controller, etc.)', value: 'part' },
                { name: 'Standalone Resource (e.g., tsconfig)', value: 'standalone' },
            ],
        },
        {
            type: 'input',
            name: 'resourceName',
            message: 'Resource name (e.g., User):',
            validate: (input) => /^[A-Za-z][A-Za-z0-9]*$/.test(input) ||
                'Resource name must start with a letter and contain only alphanumeric characters.',
            when: (answers) => answers.resourceType !== 'standalone'
        },
        {
            type: 'list',
            name: 'subResourceType',
            message: 'Select the part of the module to generate:',
            choices: Object.values(RESOURCE_TYPES).filter((type) => type !== RESOURCE_TYPES.FULL_MODULE && type !== RESOURCE_TYPES.TSCONFIG),
            when: (answers) => answers.resourceType === 'part',
        },
        {
            type: 'list',
            name: 'standaloneType',
            message: 'Select the standalone resource to generate:',
            choices: [RESOURCE_TYPES.TSCONFIG],
            when: (answers) => answers.resourceType === 'standalone',
        },
        {
            type: 'list',
            name: 'orm',
            message: 'Select the ORM/DB for the model:',
            choices: Object.values(SUPPORTED_ORMS),
            when: (answers) => answers.resourceType === RESOURCE_TYPES.FULL_MODULE || answers.subResourceType === RESOURCE_TYPES.MODEL,
        },
        {
            type: 'list',
            name: 'repository',
            message: 'Select the ORM/DB for the repository:',
            choices: Object.values(SUPPORTED_ORMS),
            when: (answers) => answers.subResourceType === RESOURCE_TYPES.REPOSITORY,
        },
    ];
    return await inquirer.prompt(questions);
}
async function generateFullModule(resourceName, targetDir, orm) {
    const moduleComponents = [
        RESOURCE_TYPES.SERVICE,
        RESOURCE_TYPES.CONTROLLER,
        RESOURCE_TYPES.ROUTE,
        RESOURCE_TYPES.REPOSITORY,
        RESOURCE_TYPES.DTO,
        RESOURCE_TYPES.MODEL,
    ];
    for (const component of moduleComponents) {
        const componentTargetDir = path.join(targetDir, component === RESOURCE_TYPES.REPOSITORY ? "repositories" : component.toLowerCase() + "s");
        ensureDirectoryExists(componentTargetDir);
        if (component === RESOURCE_TYPES.REPOSITORY) {
            await generateRepository(resourceName, componentTargetDir, orm);
        }
        else {
            await generateResourceFile(resourceName, component, orm, componentTargetDir);
        }
    }
}
async function generateRepository(resourceName, targetDir, repository) {
    resourceName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
    if (!fs.existsSync(path.join(targetDir, 'repository.interface.ts'))) {
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
    }
    else {
        console.log(chalk.yellow(`Generic repository support is not implemented.`));
    }
}
async function generateResourceFile(resourceName, resourceType, orm, targetDir) {
    resourceName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
    const templateName = getTemplateName(resourceType, orm);
    const rawTemplate = await loadTemplate(templateName);
    const fileContent = replacePlaceholders(rawTemplate, resourceName);
    const fileName = `${resourceName.toLowerCase()}.${resourceType}.ts`;
    writeFileSafely(path.join(targetDir, fileName), fileContent);
}
function getTemplateName(resourceType, orm) {
    const modelTemplates = {
        [SUPPORTED_ORMS.MONGOOSE]: 'mongoose',
        [SUPPORTED_ORMS.SEQUELIZE]: 'sequelize',
        [SUPPORTED_ORMS.GENERIC]: 'generic-model',
    };
    if (resourceType === RESOURCE_TYPES.MODEL) {
        return modelTemplates[orm] || 'generic-model';
    }
    const templates = {
        [RESOURCE_TYPES.SERVICE]: 'service',
        [RESOURCE_TYPES.CONTROLLER]: 'controller',
        [RESOURCE_TYPES.ROUTE]: 'route',
        [RESOURCE_TYPES.REPOSITORY]: `${orm?.split(' ')[0]}-repository`,
        [RESOURCE_TYPES.DTO]: 'dto',
        [RESOURCE_TYPES.MODEL]: 'model',
        [RESOURCE_TYPES.TSCONFIG]: 'tsconfig',
        [RESOURCE_TYPES.FULL_MODULE]: 'full-module'
    };
    return templates[resourceType] || '';
}
function logError(error) {
    console.log(chalk.red(`Error: ${error}`));
}
