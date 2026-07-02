const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendDir = path.join(__dirname, '..', 'frontend');
const assetsDir = path.join(__dirname, '..', 'assets');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(assetsDir));
app.use(express.static(frontendDir));

// Initialize database
db.init();

// API Routes
app.use('/api', routes);

// Serve index.html for frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Movie Recommendation Backend running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
