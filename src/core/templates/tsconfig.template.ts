export const template = `{
    "compilerOptions": {
        "module": "NodeNext",          // Aligns with moduleResolution
        "moduleResolution": "NodeNext", // Resolves imports in Node.js ESM style
        "target": "ES2020",            // Supports modern JavaScript features
        "outDir": "./dist",            // Output directory for compiled files
        "rootDir": "./src",            // Source directory for TypeScript files
        "esModuleInterop": true,       // Allows compatibility with CommonJS modules
        "strict": true,                // Enables strict type-checking
        "baseUrl": "./", 
        "paths": {
          "*": ["*"]                   // Ensures compatibility with tools like tsc-alias
        }
      },
      "include": ["src/**/*"],
      "exclude": ["src/templates"]      // Prevents compiling the templates directory
}
`;