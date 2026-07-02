const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'movies.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('✓ SQLite database connected');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

function init() {
  // Movies table
  db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      rating REAL NOT NULL,
      year INTEGER NOT NULL,
      image TEXT,
      synopsis TEXT
    )
  `);

  // Watchlist table (user sessions stored by unique ID)
  db.run(`
    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      movie_id INTEGER NOT NULL,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(movie_id) REFERENCES movies(id),
      UNIQUE(user_id, movie_id)
    )
  `);

  // Seen movies table
  db.run(`
    CREATE TABLE IF NOT EXISTS seen_movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      movie_id INTEGER NOT NULL,
      seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(movie_id) REFERENCES movies(id),
      UNIQUE(user_id, movie_id)
    )
  `);

  console.log('✓ Database tables initialized');
}

function seedMovies(movies) {
  const insertMovie = db.prepare(`
    INSERT OR IGNORE INTO movies (id, title, genre, rating, year, image, synopsis)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  movies.forEach(movie => {
    insertMovie.run(
      movie.id,
      movie.title,
      movie.genre,
      movie.rating,
      movie.year,
      movie.image,
      movie.synopsis
    );
  });

  insertMovie.finalize();
  console.log(`✓ Seeded ${movies.length} movies into database`);
}

function getAll(callback) {
  db.all('SELECT * FROM movies ORDER BY rating DESC', callback);
}

function getById(id, callback) {
  db.get('SELECT * FROM movies WHERE id = ?', [id], callback);
}

function getWatchlist(userId, callback) {
  db.all(
    `SELECT m.* FROM movies m
     INNER JOIN watchlist w ON m.id = w.movie_id
     WHERE w.user_id = ?
     ORDER BY w.added_at DESC`,
    [userId],
    callback
  );
}

function addToWatchlist(userId, movieId, callback) {
  db.run(
    'INSERT OR IGNORE INTO watchlist (user_id, movie_id) VALUES (?, ?)',
    [userId, movieId],
    callback
  );
}

function removeFromWatchlist(userId, movieId, callback) {
  db.run(
    'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
    [userId, movieId],
    callback
  );
}

function getSeen(userId, callback) {
  db.all(
    'SELECT movie_id FROM seen_movies WHERE user_id = ? ORDER BY seen_at DESC',
    [userId],
    callback
  );
}

function toggleSeen(userId, movieId, callback) {
  db.get(
    'SELECT id FROM seen_movies WHERE user_id = ? AND movie_id = ?',
    [userId, movieId],
    (err, row) => {
      if (row) {
        // Remove from seen
        db.run(
          'DELETE FROM seen_movies WHERE user_id = ? AND movie_id = ?',
          [userId, movieId],
          callback
        );
      } else {
        // Add to seen
        db.run(
          'INSERT INTO seen_movies (user_id, movie_id) VALUES (?, ?)',
          [userId, movieId],
          callback
        );
      }
    }
  );
}

function getStats(userId, callback) {
  db.all(
    `SELECT 
      (SELECT COUNT(*) FROM movies) as total,
      (SELECT COUNT(*) FROM watchlist WHERE user_id = ?) as watchlist_count,
      (SELECT COUNT(*) FROM seen_movies WHERE user_id = ?) as seen_count,
      (SELECT COUNT(DISTINCT genre) FROM movies) as genres,
      (SELECT AVG(rating) FROM movies) as avg_rating
    `,
    [userId, userId],
    (err, rows) => {
      if (err) callback(err);
      else callback(null, rows[0]);
    }
  );
}

module.exports = {
  db,
  init,
  seedMovies,
  getAll,
  getById,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getSeen,
  toggleSeen,
  getStats
};
