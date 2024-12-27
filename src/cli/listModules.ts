import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function listModules(searchTerm?: string) {
  // Step 1: List Local Templates
  const templatesPath = path.resolve(__dirname, '../templates');
  let localModules: string[] = [];

  if (fs.existsSync(templatesPath)) {
    if(searchTerm) {
      localModules = fs.readdirSync(templatesPath).filter((dir) => {
        return fs.statSync(path.join(templatesPath, dir)).isDirectory() && dir.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    else {
      localModules = fs.readdirSync(templatesPath).filter((dir) => {
        // Ensure it's a folder and has an index.ts or similar
        return fs.statSync(path.join(templatesPath, dir)).isDirectory();
      });
    }
  }

  // Step 2: Fetch Modules from npm Registry
  console.log(chalk.blue('Fetching npm modules starting with "jhipster-"...'));

  const npmModules: string[] = await fetchNpmModules('jshipster-', searchTerm);

  // Step 3: Display Results
  console.log(chalk.green('\nAvailable TypeScript Modules:'));

  if (localModules.length > 0) {
    console.log(chalk.green('Local Templates:'));
    localModules.forEach((mod) => {
      console.log(` - ${mod}`);
    });
  } else {
    console.log(chalk.yellow('No local templates found.'));
  }

  if (npmModules.length > 0) {
    console.log(chalk.green('\nUser-made Packages:'));
    npmModules.forEach((mod) => {
      console.log(` - ${mod.split('jshipster-')[1]}`);
    });
  } else {
    console.log(chalk.yellow('No user-made modules found.'));
  }
}

async function fetchNpmModules(prefix: string, searchTerm?: string): Promise<string[]> {
  const registryUrl = `https://registry.npmjs.org/-/v1/search?text=${prefix}&size=20`;

  try {
    const response = await fetch(registryUrl);
    if (!response.ok) {
      console.error(chalk.red('Failed to fetch user-made modules.'));
      return [];
    }

    const data : any = await response.json();
    const packages = data.objects.map((obj: any) => obj.package.name);
    const userModules = packages.filter((mod: string) => mod.startsWith(prefix));
    if (searchTerm) {
      return userModules.filter((mod: string) => mod.includes(searchTerm));
    }
    return userModules;
  } catch (error) {
    console.error(chalk.red(`Error fetching user-made modules: ${error}`));
    return [];
  }
}
