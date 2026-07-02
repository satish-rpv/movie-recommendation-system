const movies = require("./movies");

class MovieRecommender {
  constructor() {
    this.movies = movies;
  }

  /** Get all unique genres in the dataset */
  getGenres() {
    return [...new Set(this.movies.map((m) => m.genre))];
  }

  /** Recommend movies by genre */
  recommendByGenre(genre) {
    const results = this.movies
      .filter((m) => m.genre.toLowerCase() === genre.toLowerCase())
      .sort((a, b) => b.rating - a.rating);

    if (results.length === 0) {
      console.log(`No movies found for genre "${genre}".`);
    }
    return results;
  }

  /** Recommend movies with a minimum rating */
  recommendByMinRating(minRating) {
    return this.movies
      .filter((m) => m.rating >= minRating)
      .sort((a, b) => b.rating - a.rating);
  }

  /** Recommend movies released in a specific year */
  recommendByYear(year) {
    return this.movies
      .filter((m) => m.year === year)
      .sort((a, b) => b.rating - a.rating);
  }

  /** Recommend top N movies overall */
  getTopRated(n = 5) {
    return this.movies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, n);
  }

  /** Get the newest releases */
  getRecentReleases(minYear = 2021, n = 5) {
    return this.movies
      .filter((m) => m.year >= minYear)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, n);
  }

  /** Get the highest-rated movie for each genre */
  getGenreLeaders() {
    const leaders = {};
    this.movies.forEach((movie) => {
      if (!leaders[movie.genre] || leaders[movie.genre].rating < movie.rating) {
        leaders[movie.genre] = movie;
      }
    });
    return Object.values(leaders).sort((a, b) => b.rating - a.rating);
  }

  /** Simple catalog stats */
  getStats() {
    const total = this.movies.length;
    const avgRating = this.movies.reduce((sum, movie) => sum + movie.rating, 0) / total;
    const genres = [...new Set(this.movies.map((movie) => movie.genre))];
    const newestYear = Math.max(...this.movies.map((movie) => movie.year));
    const oldestYear = Math.min(...this.movies.map((movie) => movie.year));

    return {
      total,
      avgRating: Number(avgRating.toFixed(1)),
      genres,
      newestYear,
      oldestYear,
    };
  }

  /** Search movies by title keyword */
  searchByTitle(keyword) {
    return this.movies.filter((m) =>
      m.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /** Display a formatted list of movies */
  static display(movieList) {
    if (movieList.length === 0) {
      console.log("  (no results)\n");
      return;
    }
    movieList.forEach((m) => {
      console.log(
        `  [${m.id}] ${m.title} | Genre: ${m.genre} | Rating: ${m.rating} | Year: ${m.year}`
      );
    });
    console.log();
  }
}

module.exports = MovieRecommender;
