export const template = `import { IRepository } from '../repositories/repository.interface';
import { {{resourceName}}DTO, Create{{resourceName}}DTO, Update{{resourceName}}DTO } from '../dtos/{{resourceName.toLowerCase()}}.dto';

export class {{resourceName}}Service {
  private repository: IRepository<{{resourceName}}DTO>;

  constructor(repository: IRepository<{{resourceName}}DTO>) {
    this.repository = repository;
  }

  async getAll(): Promise<{{resourceName}}DTO[]> {
    return await this.repository.findAll();
  }

  async getById(id: string): Promise<{{resourceName}}DTO | null> {
    return await this.repository.findById(id);
  }

  async create(data: Create{{resourceName}}DTO): Promise<{{resourceName}}DTO> {
    return await this.repository.create(data);
  }

  async update(id: string, updates: Update{{resourceName}}DTO): Promise<{{resourceName}}DTO | null> {
    return await this.repository.updateOne(id, updates);
  }

  async updateMany(filter: Partial<{{resourceName}}DTO>, updates: Update{{resourceName}}DTO): Promise<number> {
    return await this.repository.updateMany(filter, updates);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.deleteOne(id);
  }

  async deleteMany(filter: Partial<{{resourceName}}DTO>): Promise<number> {
    return await this.repository.deleteMany(filter);
  }
}
`;
