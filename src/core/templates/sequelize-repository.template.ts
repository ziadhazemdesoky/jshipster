export const template = `import { Model, WhereOptions } from 'sequelize';
import { IRepository } from './repository.interface';
import {{resourceName}}, { {{resourceName}}Attributes, {{resourceName}}CreationAttributes } from '../models/{{resourceName.toLowerCase()}}.model';
import { {{resourceName}}DTO } from '../dtos/{{resourceName.toLowerCase()}}.dto';

export class {{resourceName}}Repository implements IRepository<{{resourceName}}DTO> {
  private model: typeof {{resourceName}};

  constructor() {
    this.model = {{resourceName}};
  }

  private toDTO(entity: Model & {{resourceName}}Attributes): {{resourceName}}DTO {
    const { id, ...attributes } = entity.get() as {{resourceName}}Attributes;
    return {
      id: id.toString(),
      ...attributes,
    } as {{resourceName}}DTO;
  }

  private toEntity(dto: Partial<{{resourceName}}DTO>): {{resourceName}}CreationAttributes {
    const { id, ...attributes } = dto;
    return {
      ...attributes,
      // If there are fields that should be excluded, ensure to handle that here
    } as {{resourceName}}CreationAttributes;
  }

  async findById(id: string): Promise<{{resourceName}}DTO | null> {
    const entity = await this.model.findByPk(id);
    return entity ? this.toDTO(entity as Model & {{resourceName}}Attributes) : null;
  }

  async findAll(): Promise<{{resourceName}}DTO[]> {
    const entities = await this.model.findAll();
    return entities.map(entity => this.toDTO(entity as Model & {{resourceName}}Attributes));
  }

  async create(data: {{resourceName}}DTO): Promise<{{resourceName}}DTO> {
    const entityData = this.toEntity(data);
    const entity = await this.model.create(entityData);
    return this.toDTO(entity as Model & {{resourceName}}Attributes);
  }

  async updateOne(id: string, updates: Partial<{{resourceName}}DTO>): Promise<{{resourceName}}DTO | null> {
    const record = (await this.model.findByPk(id)) as Model & {{resourceName}}Attributes | null;
    if (!record) return null;
    Object.assign(record, updates);
    await record.save();
    return this.toDTO(record);
  }

  async updateMany(filter: Partial<{{resourceName}}DTO>, updates: Partial<{{resourceName}}DTO>): Promise<number> {
    const entityUpdates = this.toEntity(updates);
    const [affectedCount] = await this.model.update(entityUpdates, { where: filter as WhereOptions });
    return affectedCount;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.model.destroy({ where: { id } });
    return result > 0;
  }

  async deleteMany(filter: Partial<{{resourceName}}DTO>): Promise<number> {
    return await this.model.destroy({ where: filter as WhereOptions });
  }
}`;
