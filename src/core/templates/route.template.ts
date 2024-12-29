export const template = `import { Router, Request, Response } from 'express';
import { {{resourceName}}Controller } from '../controllers/{{resourceName.toLowerCase()}}.controller';

const router = Router();
const {{resourceName.toLowerCase()}}Controller = new {{resourceName}}Controller();

router.get('/', (req: Request, res: Response) => {{resourceName.toLowerCase()}}Controller.getAll(req, res));
router.get('/:id', (req: Request, res: Response) => {{resourceName.toLowerCase()}}Controller.getById(req, res));
router.post('/', (req: Request, res: Response) => {{resourceName.toLowerCase()}}Controller.create(req, res));
router.put('/:id', (req: Request, res: Response) => {{resourceName.toLowerCase()}}Controller.update(req, res));
router.delete('/:id', (req: Request, res: Response) => {{resourceName.toLowerCase()}}Controller.delete(req, res));

export default router;
`;
