const MovieRecommender = require("./recommender");

const recommender = new MovieRecommender();

const stats = recommender.getStats();

// ── Catalog Overview ──────────────────────────────────
console.log("=== Catalog Overview ===");
console.log(` Total Movies: ${stats.total}`);
console.log(` Average Rating: ${stats.avgRating}`);
console.log(` Genres: ${stats.genres.join(", ")}`);
console.log(` Range: ${stats.oldestYear} – ${stats.newestYear}\n`);

// ── Available Genres ──────────────────────────────────
console.log("=== Available Genres ===");
console.log(" ", recommender.getGenres().join(", "), "\n");

// ── Top 5 Rated Movies ───────────────────────────────
console.log("=== Top 5 Rated Movies ===");
MovieRecommender.display(recommender.getTopRated(5));

// ── Recent Releases ───────────────────────────────────
console.log("=== Recent Releases (2021+) ===");
MovieRecommender.display(recommender.getRecentReleases(2021, 5));

// ── Genre Leaders ─────────────────────────────────────
console.log("=== Genre Leaders ===");
MovieRecommender.display(recommender.getGenreLeaders());

// ── Recommendations by Genre: Sci-Fi ─────────────────
console.log("=== Sci-Fi Movies ===");
MovieRecommender.display(recommender.recommendByGenre("Sci-Fi"));

// ── Movies with Rating >= 9.0 ────────────────────────
console.log("=== Movies Rated 9.0 or Above ===");
MovieRecommender.display(recommender.recommendByMinRating(9.0));

// ── Movies from 1994 ─────────────────────────────────
console.log("=== Movies from 1994 ===");
MovieRecommender.display(recommender.recommendByYear(1994));

// ── Search by Title Keyword ──────────────────────────
console.log('=== Search: "the" ===');
MovieRecommender.display(recommender.searchByTitle("the"));
