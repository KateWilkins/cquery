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

// Cognee's GET /datasets/{id}/data is a page, not the whole dataset.
// limit defaults to 100 and cannot exceed 1000. There is no total in the
// body, so keep requesting until a short page comes back.
const COGNEE_DATA_PAGE_SIZE = 1000;
const COGNEE_DATA_MAX_OFFSET = 1000000;

export async function fetchAllDatasetData(datasetId, pageSize = COGNEE_DATA_PAGE_SIZE) {
  const rows = [];
  const seen = new Set();
  let offset = 0;

  while (offset <= COGNEE_DATA_MAX_OFFSET) {
    const cogneeUrl = `http://localhost:8000/api/v1/datasets/${datasetId}/data`;
    const response = await axios.get(cogneeUrl, {
      params: { limit: pageSize, offset },
    });
    const page = response.data;
    if (!Array.isArray(page)) {
      throw new Error('Cognee dataset data response was not a list');
    }

    let added = 0;
    for (const row of page) {
      const id = row && row.id;
      if (id != null && seen.has(id)) {
        continue;
      }
      if (id != null) {
        seen.add(id);
      }
      rows.push(row);
      added += 1;
    }

    // A short page is the end. A longer page means this Cognee build ignored
    // paging and already returned every row. A page of only ids we have
    // already seen means paging made no progress, so stop rather than loop.
    if (page.length !== pageSize || added === 0) {
      return rows;
    }

    offset += page.length;
  }

  console.log('Stopped paging dataset data at Cognee offset ceiling for', datasetId);
  return rows;
}

app.get('/api/v1/datasets/:datasetId/data', async (req, res) => {
  const { datasetId } = req.params;
  console.log('Received dataset data request for:', datasetId);
  try {
    const datasetData = await fetchAllDatasetData(datasetId);
    console.log('Data response count:', datasetData.length);
    res.json(datasetData);
  } catch (error) {
    console.log('Error fetching data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/datasets/:datasetId/data/:dataId/raw', async (req, res) => {
  const { datasetId, dataId } = req.params;
  console.log('Received raw data request for:', datasetId, dataId);
  try {
    const cogneeUrl = `http://localhost:8000/api/v1/datasets/${datasetId}/data/${dataId}/raw`;
    console.log('Fetching raw data from:', cogneeUrl);
    const response = await axios.get(cogneeUrl);
    console.log('Raw data response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.log('Error fetching raw data:', error.message);
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