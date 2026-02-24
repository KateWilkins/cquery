import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API endpoints
app.post('/api/v1/search', async (req, res) => {
  console.log('Received search request:', req.body);
  try {
    const cogneeUrl = 'http://localhost:8000/api/v1/search';
    console.log('Forwarding to cognee:', req.body);
    console.log('Calling URL:', cogneeUrl);
    const response = await axios.post(cogneeUrl, req.body);
    console.log('Response from cognee:', response.data);
    res.json(response.data);
  } catch (error) {
    console.log('Error forwarding to cognee:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/datasets', async (req, res) => {
  console.log('Received datasets request');
  try {
    const cogneeUrl = 'http://localhost:8000/api/v1/datasets';
    console.log('Fetching datasets from:', cogneeUrl);
    const response = await axios.get(cogneeUrl);
    console.log('Datasets response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.log('Error fetching datasets:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all handler: send back index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(8200, () => console.log('App running on port 8200'));