# Postman Workflow

Import these files into Postman:

1. `Movie Recommendation System.postman_collection.json`
2. `Movie Recommendation System.postman_environment.json`

After import:

- Select the `Movie Recommendation System Local` environment.
- Start the backend with `npm start`.
- Use `userId` from the environment or let the collection generate one automatically.
- The API base URL is `http://localhost:5000/api`.

Useful requests:

- `GET /movies`
- `GET /movies/:id`
- `GET /watchlist`
- `POST /watchlist/add`
- `POST /watchlist/remove`
- `GET /seen`
- `POST /seen/toggle`
- `GET /stats`
- `GET /search?q=...`
- `GET /genre/:genre`
- `GET /filter/rating?min=...&max=...`
