const express = require('express');
const router = express.Router();
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

// Middleware to get or create user ID
router.use((req, res, next) => {
  let userId = req.headers['x-user-id'];
  
  if (!userId) {
    userId = uuidv4();
    res.setHeader('x-user-id', userId);
  }
  
  req.userId = userId;
  next();
});

// GET all movies
router.get('/movies', (req, res) => {
  db.getAll((err, movies) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(movies);
  });
});

// GET single movie
router.get('/movies/:id', (req, res) => {
  db.getById(req.params.id, (err, movie) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  });
});

// GET watchlist
router.get('/watchlist', (req, res) => {
  db.getWatchlist(req.userId, (err, movies) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(movies);
  });
});

// POST add to watchlist
router.post('/watchlist/add', (req, res) => {
  const { movieId } = req.body;
  if (!movieId) return res.status(400).json({ error: 'movieId required' });

  db.addToWatchlist(req.userId, movieId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Added to watchlist' });
  });
});

// POST remove from watchlist
router.post('/watchlist/remove', (req, res) => {
  const { movieId } = req.body;
  if (!movieId) return res.status(400).json({ error: 'movieId required' });

  db.removeFromWatchlist(req.userId, movieId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Removed from watchlist' });
  });
});

// GET seen movies
router.get('/seen', (req, res) => {
  db.getSeen(req.userId, (err, movies) => {
    if (err) return res.status(500).json({ error: err.message });
    const seenIds = movies.map(m => m.movie_id);
    res.json(seenIds);
  });
});

// POST toggle seen
router.post('/seen/toggle', (req, res) => {
  const { movieId } = req.body;
  if (!movieId) return res.status(400).json({ error: 'movieId required' });

  db.toggleSeen(req.userId, movieId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Seen status toggled' });
  });
});

// GET stats
router.get('/stats', (req, res) => {
  db.getStats(req.userId, (err, stats) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(stats);
  });
});

// Search endpoint
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'query parameter required' });

  db.db.all(
    'SELECT * FROM movies WHERE title LIKE ? OR genre LIKE ? OR synopsis LIKE ?',
    [`%${q}%`, `%${q}%`, `%${q}%`],
    (err, movies) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(movies);
    }
  );
});

// Filter by genre
router.get('/genre/:genre', (req, res) => {
  db.db.all(
    'SELECT * FROM movies WHERE genre = ? ORDER BY rating DESC',
    [req.params.genre],
    (err, movies) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(movies);
    }
  );
});

// Filter by rating
router.get('/filter/rating', (req, res) => {
  const { min = 0, max = 10 } = req.query;

  db.db.all(
    'SELECT * FROM movies WHERE rating BETWEEN ? AND ? ORDER BY rating DESC',
    [parseFloat(min), parseFloat(max)],
    (err, movies) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(movies);
    }
  );
});

module.exports = router;
