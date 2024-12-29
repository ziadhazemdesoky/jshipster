export const template = `import { Model } from 'mongoose';
import { {{resourceName}}, I{{resourceName}} } from '../models/{{resourceName.toLowerCase()}}.model';
import { IRepository } from './repository.interface';
import { {{resourceName}}DTO } from '../dtos/{{resourceName.toLowerCase()}}.dto';

export class {{resourceName}}Repository implements IRepository<{{resourceName}}DTO> {
  private model: Model<I{{resourceName}}>;

  constructor() {
    this.model = {{resourceName}};
  }

  /**
   * Helper method to transform I{{resourceName}} to {{resourceName}}DTO
   */
  private toDTO(resource: I{{resourceName}}): {{resourceName}}DTO {
    return {
      id: resource._id.toString(),
      name: resource.name,
      description: resource.description,
      // Map other fields here
    };
  }

  /**
   * Find a resource by ID
   */
  async findById(id: string): Promise<{{resourceName}}DTO | null> {
    const resource = await this.model.findById(id).exec();
    return resource ? this.toDTO(resource) : null;
  }

  /**
   * Find all resources
   */
  async findAll(): Promise<{{resourceName}}DTO[]> {
    const resources = await this.model.find().exec();
    return resources.map(this.toDTO.bind(this));
  }

  /**
   * Create a new resource
   */
  async create(data: Partial<{{resourceName}}DTO>): Promise<{{resourceName}}DTO> {
    const createdResource = await this.model.create(data as Partial<I{{resourceName}}>);
    return this.toDTO(createdResource);
  }

  /**
   * Update a single resource by ID
   */
  async updateOne(id: string, updates: Partial<{{resourceName}}DTO>): Promise<{{resourceName}}DTO | null> {
    const updatedResource = await this.model
      .findOneAndUpdate({ _id: id }, updates, { new: true })
      .exec();
    return updatedResource ? this.toDTO(updatedResource) : null;
  }

  /**
   * Update multiple resources based on a filter
   */
  async updateMany(
    filter: Partial<{{resourceName}}DTO>,
    updates: Partial<{{resourceName}}DTO>
  ): Promise<number> {
    const result = await this.model.updateMany(filter, updates).exec();
    return result.modifiedCount;
  }

  /**
   * Delete a single resource by ID
   */
  async deleteOne(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Delete multiple resources based on a filter
   */
  async deleteMany(filter: Partial<{{resourceName}}DTO>): Promise<number> {
    const result = await this.model.deleteMany(filter).exec();
    return result.deletedCount || 0;
  }
}
`;
