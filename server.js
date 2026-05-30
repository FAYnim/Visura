'use strict';

// Load .env variables (GEMINI_API_KEY)
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

// ── Body parsers ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── API routes ────────────────────────────────────────────
const autoFillRoutes = require('./server/routes/autoFill');
app.use('/api', autoFillRoutes);
const PORT = process.env.PORT || 3000;

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Named routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/riwayat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'riwayat.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/prompts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prompts.html'));
});

app.listen(PORT, () => {
  console.log(`Visura running at http://localhost:${PORT}`);
});
