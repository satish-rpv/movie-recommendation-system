// API Client for movie recommendation backend
class MovieAPI {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.userId = localStorage.getItem('userId') || this.generateUserId();
    localStorage.setItem('userId', this.userId);
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': this.userId,
      ...options.headers
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Movies endpoints
  async getMovies() {
    return this.request('/movies');
  }

  async getMovie(id) {
    return this.request(`/movies/${id}`);
  }

  async searchMovies(query) {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }

  async getMoviesByGenre(genre) {
    return this.request(`/genre/${genre}`);
  }

  async getMoviesByRating(min, max) {
    return this.request(`/filter/rating?min=${min}&max=${max}`);
  }

  // Watchlist endpoints
  async getWatchlist() {
    return this.request('/watchlist');
  }

  async addToWatchlist(movieId) {
    return this.request('/watchlist/add', {
      method: 'POST',
      body: JSON.stringify({ movieId })
    });
  }

  async removeFromWatchlist(movieId) {
    return this.request('/watchlist/remove', {
      method: 'POST',
      body: JSON.stringify({ movieId })
    });
  }

  // Seen movies endpoints
  async getSeen() {
    return this.request('/seen');
  }

  async toggleSeen(movieId) {
    return this.request('/seen/toggle', {
      method: 'POST',
      body: JSON.stringify({ movieId })
    });
  }

  // Stats endpoint
  async getStats() {
    return this.request('/stats');
  }
}

// Create singleton instance
const api = new MovieAPI();
