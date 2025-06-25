// CyberShellX Offline Server
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(join(__dirname, '../client/dist')));

// Offline API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'offline',
    mode: 'termux',
    timestamp: new Date().toISOString(),
    message: 'CyberShellX running in offline mode'
  });
});

app.get('/api/ai/status', (req, res) => {
  res.json({
    status: 'offline',
    providers: ['local'],
    message: 'AI providers not available in offline mode'
  });
});

app.post('/api/ai/generate', (req, res) => {
  const { prompt } = req.body;
  res.json({
    success: false,
    message: 'AI generation not available in offline mode. Use CLI interface for offline commands.',
    suggestion: 'Run: node cli-interface.js'
  });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🛡️  CyberShellX Offline Server running on port ${PORT}`);
  console.log(`📱 Termux Web Interface: http://localhost:${PORT}`);
  console.log(`💻 CLI Interface: node cli-interface.js`);
});
