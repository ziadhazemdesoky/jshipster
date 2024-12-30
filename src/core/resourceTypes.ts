enum ResourceCategories {
  FULL_MODULE = 'full-module',
  PART = 'part',
  STANDALONE = 'standalone',
}

enum ResourceTypes {
  SERVICE = 'service',
  CONTROLLER = 'controller',
  ROUTE = 'route',
  REPOSITORY = 'repository',
  DTO = 'dto',
  MODEL = 'model',
  TSCONFIG = 'tsconfig',
  SWAGGER = 'swagger',
}


enum SupportedOrms {
  MONGOOSE = 'Mongoose (MongoDB)',
  SEQUELIZE = 'Sequelize (SQL)',
  GENERIC = 'Generic',
}

// Utility function to get all resource categories as an array
const getResourceCategories = (): string[] => Object.values(ResourceCategories);

// Utility function to get all resource types as an array
const getResourceTypes = (): string[] => Object.values(ResourceTypes);

// Utility function to get all supported ORMs as an array
const getSupportedOrms = (): string[] => Object.values(SupportedOrms);

// Exporting for external usage
export {
  ResourceCategories,
  ResourceTypes,
  SupportedOrms,
  getResourceCategories,
  getResourceTypes,
  getSupportedOrms,
};

// Types for Resource Categories, Resource Types, and ORMs
export type ResourceCategory = ResourceCategories;
export type ResourceType = ResourceTypes;
export type OrmType = SupportedOrms;

export function toLowerCase(resourceType: ResourceType): string {
  return resourceType.toLowerCase();
}
