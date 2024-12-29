export const template = `
import { Request, Response } from 'express';
import { {{resourceName}}Service } from '../services/{{resourceName.toLowerCase()}}.service';
import { RepositoryFactory } from '../repositories/repository.factory';

export class {{resourceName}}Controller {
  private {{resourceName.toLowerCase()}}Service: {{resourceName}}Service;

  constructor() {
    this.{{resourceName.toLowerCase()}}Service = new {{resourceName}}Service(RepositoryFactory.create{{resourceName}}Repository());
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {{resourceName.toLowerCase()}}s = await this.{{resourceName.toLowerCase()}}Service.getAll();
      res.status(200).json({ data: {{resourceName.toLowerCase()}}s });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch {{resourceName.toLowerCase()}}s', error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const {{resourceName.toLowerCase()}} = await this.{{resourceName.toLowerCase()}}Service.getById(req.params.id);
      if (!{{resourceName.toLowerCase()}}) {
        res.status(404).json({ message: '{{resourceName}} not found' });
        return;
      }
      res.status(200).json({ data: {{resourceName.toLowerCase()}} });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch {{resourceName.toLowerCase()}}', error });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const new{{resourceName}} = await this.{{resourceName.toLowerCase()}}Service.create(req.body);
      res.status(201).json({ data: new{{resourceName}} });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create {{resourceName}}', error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated{{resourceName}} = await this.{{resourceName.toLowerCase()}}Service.update(req.params.id, req.body);
      if (!updated{{resourceName}}) {
        res.status(404).json({ message: '{{resourceName}} not found' });
        return;
      }
      res.status(200).json({ data: updated{{resourceName}} });
    } catch (error) {
      res.status(400).json({ message: 'Failed to update {{resourceName}}', error });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.{{resourceName.toLowerCase()}}Service.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: '{{resourceName}} not found' });
        return;
      }
      res.status(200).json({ message: '{{resourceName}} deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete {{resourceName}}', error });
    }
  }
}
`;