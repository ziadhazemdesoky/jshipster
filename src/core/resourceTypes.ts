export const RESOURCE_TYPES = {
    SERVICE: 'service',
    CONTROLLER: 'controller',
    ROUTE: 'route',
    MODEL: 'model',
    REPOSITORY: 'repository',
    DTO: 'dto',
    TSCONFIG: 'tsconfig',
    MICROSERVICE: 'microservice',
  } as const;
  
  export const SUPPORTED_ORMS = {
    MONGOOSE: 'Mongoose (MongoDB)',
    SEQUELIZE: 'Sequelize (SQL)',
    GENERIC: 'Generic',
  } as const;
  
  // Types for Resource Types and ORM
  export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];
  export type OrmType = typeof SUPPORTED_ORMS[keyof typeof SUPPORTED_ORMS];
  