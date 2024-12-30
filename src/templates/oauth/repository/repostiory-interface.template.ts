export interface IRepository<T> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    updateOne(id: string, updates: Partial<T>): Promise<T | null>;
    updateMany(filter: Partial<T>, updates: Partial<T>): Promise<number>;
    deleteOne(id: string): Promise<boolean>;
    deleteMany(filter: Partial<T>): Promise<number>;
}  