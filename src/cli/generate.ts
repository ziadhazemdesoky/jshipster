import inquirer, { DistinctQuestion } from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import { ConfigManager } from '../core/configManager.js';
import { ResourceCategories, ResourceTypes, SupportedOrms, ResourceType, OrmType, toLowerCase } from '../core/resourceTypes.js';
import { loadTemplate } from '../core/utils/templateUtils.js';
import { ensureDirectoryExists, generateResourceFile, writeFileSafely } from '../core/utils/fileUtils.js';
import { generateRepository } from '../core/utils/repositoryUtils.js';
import { generateSwaggerFromControllers } from '../core/utils/swaggerUtils.js';

const standaloneTypes = [
  { type: ResourceTypes.TSCONFIG, template: 'tsconfig', output: 'tsconfig.json' },
  { type: ResourceTypes.SWAGGER, template: 'swagger', output: 'swagger.yaml' },
];

const partTypes = Object.values(ResourceTypes).filter((type) => !standaloneTypes.map(record => record.type).includes(type));

export async function generateResource(): Promise<void> {
  try {
    const configManager = new ConfigManager();
    const directories = configManager.getDirectories();
    const answers = await promptUserForResourceDetails();

    const {
      resourceName,
      resourceType,
      subResourceType,
      standaloneType,
      orm,
      repository,
    } = answers;

    switch (resourceType) {
      case ResourceCategories.FULL_MODULE:
        if (resourceName) {
          const targetDir = path.resolve(process.cwd(), directories.module);
          ensureDirectoryExists(targetDir);
          await generateFullModule(resourceName, targetDir, orm);
        }
        break;

      case ResourceCategories.PART:
        await handlePartResource(resourceName, subResourceType, directories, repository, orm);
        break;

      case ResourceCategories.STANDALONE:
        await handleStandaloneResource(standaloneType, directories);
        break;

      default:
        logError('Invalid resource type.');
    }

    console.log(chalk.green('Resource generated successfully.'));
  } catch (error) {
    logError(error);
  }
}

async function promptUserForResourceDetails(): Promise<PromptAnswers> {
  const questions: DistinctQuestion[] = [
    {
      type: 'list',
      name: 'resourceType',
      message: 'Select the type of resource to generate:',
      choices: [
        { name: 'Full Module (service, controller, route, etc.)', value: ResourceCategories.FULL_MODULE },
        { name: 'Part of a Module (service, controller, etc.)', value: ResourceCategories.PART },
        { name: 'Standalone Resource (e.g., tsconfig)', value: ResourceCategories.STANDALONE },
      ],
    },
    {
      type: 'input',
      name: 'resourceName',
      message: 'Resource name (e.g., User):',
      validate: (input: string) =>
        /^[A-Za-z][A-Za-z0-9]*$/.test(input) ||
        'Resource name must start with a letter and contain only alphanumeric characters.',
      when: (answers) => answers.resourceType !== ResourceCategories.STANDALONE,
    },
    {
      type: 'list',
      name: 'subResourceType',
      message: 'Select the part of the module to generate:',
      choices: partTypes,
      when: (answers) => answers.resourceType === ResourceCategories.PART,
    },
    {
      type: 'list',
      name: 'standaloneType',
      message: 'Select the standalone resource to generate:',
      choices: standaloneTypes.map((type) => ({
        name: type.type,
        value: type.type,
      })),
      when: (answers) => answers.resourceType === ResourceCategories.STANDALONE,
    },
    {
      type: 'list',
      name: 'orm',
      message: 'Select the ORM/DB for the model:',
      choices: Object.values(SupportedOrms),
      when: (answers) =>
        answers.resourceType === ResourceCategories.FULL_MODULE ||
        answers.subResourceType === ResourceTypes.MODEL,
    },
    {
      type: 'list',
      name: 'repository',
      message: 'Select the ORM/DB for the repository:',
      choices: Object.values(SupportedOrms),
      when: (answers) => answers.subResourceType === ResourceTypes.REPOSITORY,
    },
  ];

  return await inquirer.prompt(questions);
}

async function generateFullModule(
  resourceName: string,
  targetDir: string,
  orm: OrmType | undefined
): Promise<void> {
  const moduleComponents = [
    ResourceTypes.SERVICE,
    ResourceTypes.CONTROLLER,
    ResourceTypes.ROUTE,
    ResourceTypes.REPOSITORY,
    ResourceTypes.DTO,
    ResourceTypes.MODEL,
  ];

  for (const component of moduleComponents) {
    const componentDir = path.join(
      targetDir,
      component === ResourceTypes.REPOSITORY ? 'repositories' : `${toLowerCase(component)}s`
    );
    ensureDirectoryExists(componentDir);

    if (component === ResourceTypes.REPOSITORY) {
      await generateRepository(resourceName, componentDir, orm);
    } else {
      await generateResourceFile(resourceName, component, componentDir, orm);
    }
  }
}

async function handlePartResource(
  resourceName: string | undefined,
  subResourceType: ResourceType | undefined,
  directories: Record<string, string>,
  repository: OrmType | undefined,
  orm: OrmType | undefined
): Promise<void> {
  if (!resourceName) return logError('Invalid resource name.');
  if (!subResourceType) return logError('Invalid subresource type.');

  const targetDir = directories[toLowerCase(subResourceType)];
  if (!targetDir) {
    logError(`No directory mapping found for "${subResourceType}" in the configuration.`);
    return;
  }

  const fullTargetDir = path.resolve(process.cwd(), targetDir);
  ensureDirectoryExists(fullTargetDir);

  if (subResourceType === ResourceTypes.REPOSITORY) {
    await generateRepository(resourceName, fullTargetDir, repository);
  } else {
    await generateResourceFile(resourceName, subResourceType, fullTargetDir, orm);
  }
}

async function handleStandaloneResource(
  standaloneType: ResourceType | undefined,
  directories: Record<string, string>
): Promise<void> {
  if (!standaloneType) return logError('Invalid standalone resource type.');

  const standaloneConfig = standaloneTypes.find((type) => type.type === standaloneType);
  if (!standaloneConfig) {
    logError('Unsupported standalone resource type.');
    return;
  }

  const targetDir = directories[toLowerCase(standaloneType)];
  if (!targetDir) {
    logError(`No directory mapping found for "${standaloneType}" in the configuration.`);
    return;
  }

  const fullTargetDir = path.resolve(process.cwd(), targetDir);
  ensureDirectoryExists(fullTargetDir);

  if (standaloneType === ResourceTypes.SWAGGER) {
    await generateSwaggerFromControllers(
      directories[ResourceTypes.CONTROLLER],
      path.join(fullTargetDir, standaloneConfig.output)
    );
  } else {
    const template = await loadTemplate(standaloneConfig.template);
    writeFileSafely(path.join(fullTargetDir, standaloneConfig.output), template);
  }
}


function logError(error: unknown): void {
  console.log(chalk.red(`Error: ${error}`));
}

interface PromptAnswers {
  resourceName?: string;
  resourceType?: ResourceType | ResourceCategories;
  subResourceType?: ResourceType;
  standaloneType?: ResourceType;
  orm?: OrmType;
  repository?: OrmType;
}
