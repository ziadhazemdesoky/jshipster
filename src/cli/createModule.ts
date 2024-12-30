import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export async function createModule() {
  const answers = await inquirer.prompt<{ moduleName: string }>([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Enter the name of the new module:',
      validate: (input) => input.trim() !== '' || 'Module name cannot be empty',
    },
  ]);

  const { moduleName } = answers;
  const modulePath = path.resolve(process.cwd(), moduleName);

  if (fs.existsSync(modulePath)) {
    console.log(chalk.red(`Module "${moduleName}" already exists.`));
    return;
  }

  // Create the module blueprint structure
  fs.mkdirSync(modulePath, { recursive: true });

  // Create index.ts
  fs.writeFileSync(
    path.join(modulePath, 'index.ts'),
    `import { Application } from 'express';

export function init(app: Application) {
  app.get('/${moduleName}', (req, res) => {
    res.json({ message: 'Hello from ${moduleName}!' });
  });
}
`
  );

  // Create optional subdirectories
  fs.mkdirSync(path.join(modulePath, 'service'));
  fs.mkdirSync(path.join(modulePath, 'controller'));
  fs.mkdirSync(path.join(modulePath, 'route'));
  fs.mkdirSync(path.join(modulePath, 'model'));
  fs.mkdirSync(path.join(modulePath, 'repository'));

  // Create a package.json
  fs.writeFileSync(
    path.join(modulePath, 'package.json'),
    JSON.stringify(
      {
        name: `jshipster-${moduleName.toLowerCase()}`,
        version: '1.0.0',
        description: `A JSHipster module for ${moduleName}`,
        main: 'index.js',
        types: 'index.d.ts',
        scripts: {
          build: 'tsc',
          test: 'echo "No tests specified"',
        },
        keywords: ['jshipster', 'module', `${moduleName}`],
        author: 'Your Name',
        license: 'MIT',
        dependencies: {
          express: '^4.18.2',
        },
        devDependencies: {
          typescript: '^4.9.5',
          '@types/node': '^18.15.11',
          '@types/express': '^4.17.15',
        },
      },
      null,
      2
    )
  );

  // Create README.md
  fs.writeFileSync(
    path.join(modulePath, 'README.md'),
    `# ${moduleName}

## Description
This is a module created with JSHipster. It provides the following functionality:

- Exposes an endpoint at \`/${moduleName}\`.

## Usage
1. Add the module to your project:
   \`\`\`bash
   npm install jshipster-${moduleName.toLowerCase()}
   \`\`\`

2. Import and initialize the module in your Express app:
   \`\`\`typescript
   import { init as init${moduleName} } from 'jshipster-${moduleName.toLowerCase()}';
   init${moduleName}(app);
   \`\`\`

3. Access the endpoint:
   \`\`\`
   GET /${moduleName}
   \`\`\`

## Development
- Build: \`npm run build\`
- Test: \`npm test\`

## License
This module is licensed under the MIT license.
`
  );

  console.log(chalk.green(`Module "${moduleName}" created successfully at ${modulePath}.`));
  console.log(chalk.blue(`Next steps:`));
  console.log(`  cd ${moduleName}`);
  console.log(`  npm install`);
  console.log(`  npm publish --access public`);
}
