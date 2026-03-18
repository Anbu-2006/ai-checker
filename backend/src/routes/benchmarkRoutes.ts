import { Router, Request, Response, NextFunction } from 'express';
import { runBenchmark, getHistory } from '../controllers/benchmarkController';

const router = Router();

// Wrapper for async errors
const asyncRoute = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/run', asyncRoute(runBenchmark) as any);
router.get('/history', asyncRoute(getHistory) as any);

export default router;
