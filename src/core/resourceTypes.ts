export const RESOURCE_TYPES = {
  SERVICE: 'service',
  CONTROLLER: 'controller',
  ROUTE: 'route',
  REPOSITORY: 'repository',
  DTO: 'dto',
  MODEL: 'model',
  TSCONFIG: 'tsconfig',
  SWAGGER: 'swagger',
  FULL_MODULE: 'full-module',
} as const;

export const SUPPORTED_ORMS = {
  MONGOOSE: 'Mongoose (MongoDB)',
  SEQUELIZE: 'Sequelize (SQL)',
  GENERIC: 'Generic',
} as const;

// Types for Resource Types and ORM
export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];
export type OrmType = typeof SUPPORTED_ORMS[keyof typeof SUPPORTED_ORMS];
