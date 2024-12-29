import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Automatically generate the RepositoryFactory based on available repository files and SUPPORTED_ORMS
 */
export function generateRepositoryFactory(repositoriesDir: string): void {
  const availableRepositories = getAvailableRepositories(repositoriesDir);

  if (Object.keys(availableRepositories).length === 0) {
    console.log(chalk.red('No repository files found in the repositories directory.'));
    return;
  }

  // Generate the factory content
  const factoryContent = generateFactoryContent(availableRepositories);
  const factoryFilePath = path.join(repositoriesDir, 'repository.factory.ts');
  const fileExisting = fs.existsSync(factoryFilePath);
  fs.writeFileSync(factoryFilePath, factoryContent, 'utf-8');
  fileExisting ? console.log(chalk.green(`Repository factory successfully updated.`)) : console.log(chalk.green(`Repository factory successfully generated.`));
}

/**
 * Scans the repositories directory for available repository files matching SUPPORTED_ORMS
 * @param {string} directory - Path to the repositories directory
 * @returns {Record<string, string>} - A map of ORM names to repository file paths
 */
function getAvailableRepositories(directory: string): Record<string, string> {
  const availableRepositories: Record<string, string> = {};

  try {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      if(file.endsWith('.repository.ts')){
      availableRepositories[file.replace('.repository.ts', '')] = file;
    }
    })
  } catch (error) {
    console.error('Error reading repositories directory:', error);
  }

  return availableRepositories;
}

/**
 * Generates the content for the repository factory file
 * @param {Record<string, string>} availableRepositories - Map of ORM names to repository file paths
 * @returns {string} - The factory file content
 */
function generateFactoryContent(availableRepositories: Record<string, string>): string {
  const imports: string[] = [];
  const factoryMethods: string[] = [];

  Object.entries(availableRepositories).forEach(([repository, file]) => {
    const repositoryName = `${repository.charAt(0).toUpperCase() + repository.slice(1)}Repository`;
    const factoryMethodName = `create${repository.charAt(0).toUpperCase() + repository.slice(1)}Repository`;
    imports.push(`import { ${repository.charAt(0).toUpperCase() + repository.slice(1)}DTO } from '../dtos/${repository.toLowerCase()}.dto';`);
    imports.push(`import { ${repositoryName} } from './${file.replace('.ts', '')}';`);
    factoryMethods.push(`
  ${factoryMethodName}(): IRepository<${repository.charAt(0).toUpperCase() + repository.slice(1)}DTO> {
    return new ${repositoryName}();
  },`);
  });

  return `
import { IRepository } from './repository.interface';
${imports.join('\n')}

export const RepositoryFactory = {
${factoryMethods.join('\n')}
};
`;
}
