# JSHipster

A modular Node.js CLI for quickly bootstrapping backend projects. **No login required** and entirely offline-friendly.

## Features
- **Init**: Create a new backend project structure.
- **Add**: Copy a local template to your project.
- **List**: View locally available templates.
- **Generate**: Generate a resource (e.g., service, controller) in TypeScript
- **Create**: Create a new module and add it publicly to npm

## Installation
```bash
npm install -g jshipster
```


## Usage
```bash
# Create a new project
jshipster init

# List available modules
jshipster list

# Add a module (e.g., auth-jwt)
jshipster add auth-jwt

# Generate a resource (e.g., service, controller) in TypeScript
jshipster generate

# Generate a new module to be publicly available on npm.
jshipster create
```

## Contributing
- Fork this repo
- Add or modify templates in src/templates/
- Submit a pull request