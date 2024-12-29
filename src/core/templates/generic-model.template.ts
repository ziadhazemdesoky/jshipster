export const template = `
/**
 * Interface representing the structure of the {{resourceName}} resource
 */
export interface {{resourceName}} {
  /**
   * Unique identifier for the {{resourceName}} resource
   */
  id: string;

  /**
   * Name of the {{resourceName}}
   */
  name: string;

  /**
   * Optional description for the {{resourceName}}
   */
  description?: string;

  /**
   * Indicates whether the {{resourceName}} is active
   */
  isActive: boolean;

  /**
   * Timestamp of when the {{resourceName}} was created
   */
  createdAt?: Date;

  /**
   * Timestamp of when the {{resourceName}} was last updated
   */
  updatedAt?: Date;
}

/**
 * Interface defining CRUD methods for {{resourceName}} implementations
 */
export interface I{{resourceName}}Methods {
  /**
   * Find a {{resourceName}} by its unique identifier
   * @param id - The unique identifier of the {{resourceName}}
   */
  findById(id: string): Promise<{{resourceName}} | null>;

  /**
   * Retrieve all {{resourceName}} resources
   */
  findAll(): Promise<{{resourceName}}[]>;

  /**
   * Create a new {{resourceName}} resource
   * @param data - The data for the new {{resourceName}}
   */
  create(data: Partial<{{resourceName}}>): Promise<{{resourceName}}>;

  /**
   * Update an existing {{resourceName}} resource
   * @param id - The unique identifier of the {{resourceName}}
   * @param updates - The data to update the {{resourceName}}
   */
  update(id: string, updates: Partial<{{resourceName}}>): Promise<{{resourceName}} | null>;

  /**
   * Delete a {{resourceName}} by its unique identifier
   * @param id - The unique identifier of the {{resourceName}}
   */
  delete(id: string): Promise<boolean>;
}
`;
