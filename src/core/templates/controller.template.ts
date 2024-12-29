export const template = `
import { Request, Response, Router } from 'express';
import { {{resourceName}}Service } from '../services/{{resourceName.toLowerCase()}}.service';
import { RepositoryFactory } from '../repositories/repository.factory';

const router = Router();
const {{resourceName}}ServiceInstance = new {{resourceName}}Service(RepositoryFactory.create{{resourceName}}Repository());

// Route: Get all {{resourceName}}s
router.get('/', async (req: Request, res: Response) => {
  try {
    const {{resourceName.toLowerCase()}}s = await {{resourceName}}ServiceInstance.getAll();
    res.status(200).json({ data: {{resourceName.toLowerCase()}}s });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch {{resourceName.toLowerCase()}}s', error });
  }
});

// Route: Get a {{resourceName}} by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const {{resourceName.toLowerCase()}} = await {{resourceName}}ServiceInstance.getById(req.params.id);
    if (!{{resourceName.toLowerCase()}}) {
      return res.status(404).json({ message: '{{resourceName}} not found' });
    }
    res.status(200).json({ data: {{resourceName.toLowerCase()}} });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch {{resourceName.toLowerCase()}}', error });
  }
});

// Route: Create a new {{resourceName}}
router.post('/', async (req: Request, res: Response) => {
  try {
    const new{{resourceName}} = await {{resourceName}}ServiceInstance.create(req.body);
    res.status(201).json({ data: new{{resourceName}} });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create {{resourceName}}', error });
  }
});

// Route: Update a {{resourceName}}
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated{{resourceName}} = await {{resourceName}}ServiceInstance.update(req.params.id, req.body);
    if (!updated{{resourceName}}) {
      return res.status(404).json({ message: '{{resourceName}} not found' });
    }
    res.status(200).json({ data: updated{{resourceName}} });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update {{resourceName}}', error });
  }
});

// Route: Delete a {{resourceName}}
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await {{resourceName}}ServiceInstance.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: '{{resourceName}} not found' });
    }
    res.status(200).json({ message: '{{resourceName}} deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete {{resourceName}}', error });
  }
});

export default router;
`;