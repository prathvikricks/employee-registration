# Employee Registration (3-tier application)

A small employee-registration application with three independent tiers:

- **Frontend:** static HTML/CSS/JavaScript served by Nginx
- **Backend:** Node.js/Express REST API
- **Database:** PostgreSQL

## Run it

1. Install Docker Desktop.
2. From this directory run:

   ```sh
   docker compose up --build
   ```

3. Open http://localhost:8080.

The API is available at http://localhost:3001/api/employees. PostgreSQL is exposed on port `5432` for local development.

