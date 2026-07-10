# Dashboard Backend

This is the backend API for the dashboard builder project.
It provides a minimal Express server with MySQL persistence and image upload support.

## What it does

- Saves dashboard layouts in a MySQL database
- Loads saved dashboard layouts by ID
- Updates existing dashboards
- Deletes dashboards
- Accepts image uploads and serves uploaded files

## Local setup

1. Install dependencies:
   ```bash
   cd api
   npm install
   ```

2. Create a `.env` file in `api/` with your local MySQL credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=dashboard_app
   ```

3. Start the backend:
   ```bash
   node server.js
   ```

4. Verify it is running:
   - `http://localhost:3000/health`
   - response should include: `{"ok":true,"dbReady":true}`

## Notes

- The server will create the `dashboard_app` database if it does not already exist.
- Uploaded files are stored in `api/uploads/`.
- In production, use a real MySQL host and secure credentials.

## API routes

- `GET /api/dashboards`
- `POST /api/dashboards`
- `GET /api/dashboards/:id`
- `PUT /api/dashboards/:id`
- `DELETE /api/dashboards/:id`
- `POST /api/upload`
- `GET /api/files/:id`
