import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import benchmarkRoutes from './routes/benchmarkRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Allow all origins for dev
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Serve Static Frontend Assets
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.use('/api/benchmarks', benchmarkRoutes);
// Optional: Auto-detect endpoint can be grouped inside benchmarks or standalone
app.post('/api/detect', async (req, res) => {
    const { apiKey, endpoint } = req.body;
    let provider = 'Unknown';
    let type = 'api';
    let modelsAvailable: string[] = [];

    if (endpoint) {
        type = 'local';
        try {
            const ollamaEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
            const response = await fetch(`${ollamaEndpoint}/api/tags`);
            if (response.ok) {
                const data: any = await response.json();
                provider = 'Ollama';
                modelsAvailable = data.models?.map((m: any) => m.name) || ['Failed to parse models'];
                return res.json({ success: true, provider, type, modelsAvailable });
            }
        } catch (e) {
            return res.status(400).json({ success: false, error: 'Could not connect to custom endpoint.' });
        }
    }

    if (apiKey) {
        if (apiKey.startsWith('sk-ant-')) {
            provider = 'Anthropic';
            modelsAvailable = ['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'];
        } else if (apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-')) {
            provider = 'OpenAI';
            modelsAvailable = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
        } else if (apiKey.startsWith('gsk_')) {
            provider = 'Groq';
            modelsAvailable = ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768'];
        } else {
            return res.status(400).json({ success: false, error: 'Unrecognized API key format.' });
        }
        return res.json({ success: true, provider, type, modelsAvailable });
    }
    res.status(400).json({ success: false, error: 'Must provide either an API key or local endpoint.' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'active', uptime: process.uptime() });
});

// React Router Catch-All
app.get('*any', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});




app.listen(PORT, () => {
    console.log(`Stateless Execution Node & Static Server running on port ${PORT}`);
});
