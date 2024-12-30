import { IRepository } from './repository.interface';
import { UserModel } from '../models/user.model';
import { UserDTO } from '../dtos/user.dto';

export class OAuthRepository implements IRepository<UserDTO> {
  async findById(id: string): Promise<UserDTO | null> {
    return UserModel.findById(id).exec();
  }

  async findAll(): Promise<UserDTO[]> {
    return UserModel.find().exec();
  }

  async create(data: Partial<UserDTO>): Promise<UserDTO> {
    return UserModel.create(data);
  }

  async updateOne(id: string, updates: Partial<UserDTO>): Promise<UserDTO | null> {
    return UserModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async updateMany(filter: Partial<UserDTO>, updates: Partial<UserDTO>): Promise<number> {
    const result = await UserModel.updateMany(filter, updates).exec();
    return result.modifiedCount;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async deleteMany(filter: Partial<UserDTO>): Promise<number> {
    const result = await UserModel.deleteMany(filter).exec();
    return result.deletedCount || 0;
  }

  async findByUsername(username: string): Promise<UserDTO | null> {
    return UserModel.findOne({ username }).exec();
  }

  async findByProvider(provider: string, externalId: string): Promise<UserDTO | null> {
    return UserModel.findOne({ provider, externalId }).exec();
  }
}
