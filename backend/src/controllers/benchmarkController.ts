import { Request, Response } from 'express';
import { runLLMTest, LLMTestResult } from '../services/llmService';

export const runBenchmark = async (req: Request, res: Response) => {
    try {
        const { models, prompt } = req.body;
        if (!models || models.length === 0) {
            return res.status(400).json({ error: 'At least one model is required' });
        }
        
        const results = await Promise.all(models.map((model: any) => runLLMTest(model, prompt)));
        
        // Save to DB...
        
        res.json({ success: true, results });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        // Fetch from DB...
        res.json({ history: [] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
