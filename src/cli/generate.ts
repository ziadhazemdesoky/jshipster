import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { ConfigManager } from '../core/configManager.js';
import { RESOURCE_TYPES, SUPPORTED_ORMS, ResourceType, OrmType } from '../core/resourceTypes.js';
import { loadTemplate, replacePlaceholders } from '../core/utils/templateUtils.js';
import { ensureDirectoryExists, writeFileSafely } from '../core/utils/fileUtils.js';
import { generateRepositoryFactory } from '../core/utils/repositoryUtils.js';

export async function generateResource(): Promise<void> {
  const configManager = new ConfigManager();
  const directories = configManager.getDirectories();

  try {
    const answers = await promptUserForResourceDetails();
    const { resourceName, resourceType, orm, repository } = answers;

    const targetDirKey = getTargetDirectoryKey(resourceType);
    if (!targetDirKey) {
      return logError(`Directory mapping not found for: ${resourceType}`);
    }

    const targetDir = directories[targetDirKey];
    if (!targetDir) {
      return logError(`No directory mapping found for "${resourceType}" in the configuration.`);
    }

    const fullTargetDir = path.resolve(process.cwd(), targetDir);
    ensureDirectoryExists(fullTargetDir);

    if (resourceType === RESOURCE_TYPES.REPOSITORY) {
      await generateRepository(resourceName, fullTargetDir, repository);
    } else if (resourceType === RESOURCE_TYPES.TSCONFIG) {
      const tsconfigTemplate = await loadTemplate('tsconfig');
      writeFileSafely(path.join(fullTargetDir, 'tsconfig.json'), tsconfigTemplate);
    }
      else {
      await generateResourceFile(resourceName, resourceType, orm, fullTargetDir);
    }

    console.log(chalk.green(`Resource generated successfully.`));
  } catch (error) {
    logError(error);
  }
}

async function promptUserForResourceDetails() {
  return await inquirer.prompt<{
    resourceName: string;
    resourceType: ResourceType;
    orm?: OrmType;
    repository?: OrmType;
  }>([
    {
      type: 'input',
      name: 'resourceName',
      message: 'Resource name (e.g., User):',
      validate: (input) =>
        /^[A-Za-z][A-Za-z0-9]*$/.test(input) ||
        'Resource name must start with a letter and contain only alphanumeric characters.',
    },
    {
      type: 'list',
      name: 'resourceType',
      message: 'Select the type of resource to generate:',
      choices: Object.values(RESOURCE_TYPES),
    },
    {
      type: 'list',
      name: 'orm',
      message: 'Select the ORM/DB for the model:',
      choices: Object.values(SUPPORTED_ORMS),
      when: (answers) => answers.resourceType === RESOURCE_TYPES.MODEL,
    },
    {
      type: 'list',
      name: 'repository',
      message: 'Select the ORM/DB for the repository:',
      choices: Object.values(SUPPORTED_ORMS),
      when: (answers) => answers.resourceType === RESOURCE_TYPES.REPOSITORY,
    },
  ]);
}

async function generateRepository(resourceName: string, targetDir: string, repository?: OrmType) {
  resourceName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  // Check if repository interface file exists 
  if(!fs.existsSync(path.join(targetDir, 'repository.interface.ts'))){
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

async function generateResourceFile(
  resourceName: string,
  resourceType: ResourceType,
  orm: OrmType | undefined,
  targetDir: string
) {
  resourceName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  const templateName = getTemplateName(resourceType, orm);
  const rawTemplate = await loadTemplate(templateName);
  const fileContent = replacePlaceholders(rawTemplate, resourceName);
  const fileName = `${resourceName.toLowerCase()}.${resourceType}.ts`;
  writeFileSafely(path.join(targetDir, fileName), fileContent);
}

function getTargetDirectoryKey(resourceType: ResourceType): string | null {
  const directoryMappings: Record<ResourceType, string> = {
    [RESOURCE_TYPES.SERVICE]: 'services',
    [RESOURCE_TYPES.CONTROLLER]: 'controllers',
    [RESOURCE_TYPES.MODEL]: 'models',
    [RESOURCE_TYPES.REPOSITORY]: 'repositories',
    [RESOURCE_TYPES.ROUTE]: 'routes',
    [RESOURCE_TYPES.DTO]: 'dtos',
    [RESOURCE_TYPES.TSCONFIG]: 'tsconfig',
    [RESOURCE_TYPES.MICROSERVICE]: 'microservices',
  };

  return directoryMappings[resourceType] || null;
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

function logError(error: unknown) {
  console.log(chalk.red(`Error: ${error}`));
}
