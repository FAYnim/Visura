'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Named routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/riwayat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'riwayat.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.listen(PORT, () => {
  console.log(`Visura running at http://localhost:${PORT}`);
});
