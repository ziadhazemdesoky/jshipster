export const template = `{
  "name": "{{resourceName.toLowerCase()}}-service",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "start": "npx tsc && node dist/index.js",
    "build": "tsc"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "express": "^4.21.2",
    "mongoose": "^8.9.2",
    "typescript": "^5.7.2"
  }
}

`;  
