import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { writeFileSafely } from './fileUtils.js';
import { getOrmTemplateName, loadTemplate, replacePlaceholders } from './templateUtils.js';
import { OrmType, ResourceTypes, SupportedOrms } from '../resourceTypes.js';

/**
 * Automatically generate the RepositoryFactory based on available repository files and SUPPORTED_ORMS
 */
function generateRepositoryFactory(repositoriesDir: string): void {
  const availableRepositories = getAvailableRepositories(repositoriesDir);

  if (Object.keys(availableRepositories).length === 0) {
    console.log(chalk.red('No repository files found in the repositories directory.'));
    return;
  }

  const factoryContent = generateFactoryContent(availableRepositories);
  const factoryFilePath = path.join(repositoriesDir, 'repository.factory.ts');

  if (fs.existsSync(factoryFilePath)) {
    console.log(chalk.green('Repository factory successfully updated.'));
  } else {
    console.log(chalk.green('Repository factory successfully generated.'));
  }

  fs.writeFileSync(factoryFilePath, factoryContent, 'utf-8');
}

/**
 * Scans the repositories directory for available repository files matching SUPPORTED_ORMS
 * @param {string} directory - Path to the repositories directory
 * @returns {Record<string, string>} - A map of ORM names to repository file paths
 */
function getAvailableRepositories(directory: string): Record<string, string> {
  try {
    const files = fs.readdirSync(directory);
    return files.reduce((acc, file) => {
      if (file.endsWith('.repository.ts')) {
        const name = file.replace('.repository.ts', '');
        acc[name] = file;
      }
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error(chalk.red('Error reading repositories directory:'), error);
    return {};
  }
}

/**
 * Generates the content for the repository factory file
 * @param {Record<string, string>} availableRepositories - Map of ORM names to repository file paths
 * @returns {string} - The factory file content
 */
function generateFactoryContent(availableRepositories: Record<string, string>): string {
  const imports = Object.entries(availableRepositories).map(
    ([repository, file]) => `import { ${capitalize(repository)}Repository } from './${file.replace('.ts', '')}';`
  );

  const factoryMethods = Object.entries(availableRepositories).map(
    ([repository]) => {
      const repoName = capitalize(repository);
      return `  create${repoName}Repository(): IRepository<${repoName}DTO> {
    return new ${repoName}Repository();
  },`;
    }
  );

  return `
import { IRepository } from './repository.interface';
${imports.join('\n')}

export const RepositoryFactory = {
${factoryMethods.join('\n')}
};
`;
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} - Capitalized string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a repository file and the repository factory
 * @param {string} resourceName - Name of the resource
 * @param {string} targetDir - Target directory for the repository
 * @param {OrmType | undefined} repository - Selected ORM type
 */
export async function generateRepository(
  resourceName: string,
  targetDir: string,
  repository?: OrmType
): Promise<void> {
  const capitalizedResourceName = capitalize(resourceName);

  // Ensure repository interface exists
  const repositoryInterfacePath = path.join(targetDir, 'repository.interface.ts');
  if (!fs.existsSync(repositoryInterfacePath)) {
    const repositoryInterfaceTemplate = await loadTemplate('repository-interface');
    const repositoryInterface = replacePlaceholders(repositoryInterfaceTemplate, capitalizedResourceName);
    writeFileSafely(repositoryInterfacePath, repositoryInterface);
  }

  // Generate specific repository if ORM is provided
  if (repository) {
    const templateName = `${getOrmTemplateName(repository)}-${ResourceTypes.REPOSITORY}`;
    const repositoryTemplate = await loadTemplate(templateName);
    const repositoryContent = replacePlaceholders(repositoryTemplate, capitalizedResourceName);
    const repositoryFilePath = path.join(targetDir, `${resourceName.toLowerCase()}.repository.ts`);
    writeFileSafely(repositoryFilePath, repositoryContent);
  } else {
    console.log(chalk.yellow('Generic repository support is not implemented.'));
  }

  // Update repository factory
  generateRepositoryFactory(targetDir);
}
