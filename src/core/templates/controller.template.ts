export const template = `/**
 * Controller for handling {{resourceName}} operations.
 */
import { Request, Response } from 'express';
import { {{resourceName}}Service } from '../services/{{resourceName.toLowerCase()}}.service';
import { RepositoryFactory } from '../repositories/repository.factory';
import { Create{{resourceName}}DTO, Update{{resourceName}}DTO } from '../dtos/{{resourceName.toLowerCase()}}.dto';

/**
 * Class representing the {{resourceName}}Controller.
 */
export class {{resourceName}}Controller {
  private {{resourceName.toLowerCase()}}Service: {{resourceName}}Service;

  /**
   * Constructor initializes the {{resourceName}} service.
   */
  constructor() {
    this.{{resourceName.toLowerCase()}}Service = new {{resourceName}}Service(RepositoryFactory.create{{resourceName}}Repository());
  }

  /**
   * Fetch all {{resourceName.toLowerCase()}}s.
   * @route GET /{{resourceName.toLowerCase()}}s
   * @returns {Promise<void>} List of all {{resourceName.toLowerCase()}}s.
   * @response 200 - Success
   * @response 500 - Internal Server Error
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {{resourceName.toLowerCase()}}s = await this.{{resourceName.toLowerCase()}}Service.getAll();
      res.status(200).json({ data: {{resourceName.toLowerCase()}}s });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch {{resourceName.toLowerCase()}}s', error });
    }
  }

  /**
   * Fetch a single {{resourceName.toLowerCase()}} by ID.
   * @route GET /{{resourceName.toLowerCase()}}s/:id
   * @param {string} req.params.id - ID of the {{resourceName.toLowerCase()}}.
   * @returns {Promise<void>} The requested {{resourceName.toLowerCase()}}.
   * @response 200 - Success
   * @response 404 - Not Found
   * @response 500 - Internal Server Error
   */
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

  /**
   * Create a new {{resourceName.toLowerCase()}}.
   * @route POST /{{resourceName.toLowerCase()}}s
   * @param {Create{{resourceName}}DTO} req.body - Data for the new {{resourceName.toLowerCase()}}.
   * @returns {Promise<void>} The created {{resourceName.toLowerCase()}}.
   * @response 201 - Created
   * @response 400 - Bad Request
   */
  async create(req: Request<{}, {}, Create{{resourceName}}DTO>, res: Response): Promise<void> {
    try {
      const new{{resourceName}} = await this.{{resourceName.toLowerCase()}}Service.create(req.body);
      res.status(201).json({ data: new{{resourceName}} });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create {{resourceName}}', error });
    }
  }

  /**
   * Update an existing {{resourceName.toLowerCase()}} by ID.
   * @route PUT /{{resourceName.toLowerCase()}}s/:id
   * @param {string} req.params.id - ID of the {{resourceName.toLowerCase()}} to update.
   * @param {Update{{resourceName}}DTO} req.body - Updated data for the {{resourceName.toLowerCase()}}.
   * @returns {Promise<void>} The updated {{resourceName.toLowerCase()}}.
   * @response 200 - Success
   * @response 404 - Not Found
   * @response 400 - Bad Request
   */
  async update(req: Request<{ id: string }, {}, Update{{resourceName}}DTO>, res: Response): Promise<void> {
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

  /**
   * Delete a {{resourceName.toLowerCase()}} by ID.
   * @route DELETE /{{resourceName.toLowerCase()}}s/:id
   * @param {string} req.params.id - ID of the {{resourceName.toLowerCase()}} to delete.
   * @returns {Promise<void>} Success message or error.
   * @response 200 - Success
   * @response 404 - Not Found
   * @response 500 - Internal Server Error
   */
  async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
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