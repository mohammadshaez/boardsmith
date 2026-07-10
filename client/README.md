# Dashboard Builder Client

This is the React + Vite frontend for the dashboard builder project.
It provides a drag-and-drop canvas for creating dashboard layouts with charts, text, images, and shapes.

## What it does

- Create and edit dashboard layouts
- Resize and position elements on a canvas
- Upload and render images inside dashboard cards
- Save and load dashboard layouts via the backend API

## Local setup

1. Install dependencies:

   ```bash
   cd compact-react
   npm install
   ```

2. Start the frontend:

   ```bash
   npm run dev
   ```

3. Open the app in your browser:
   - `http://localhost:5173`

## Backend connection

- The frontend expects APIs to be available at the backend host.
- If the backend is running locally at `http://localhost:3000`, the default setup should work.
- If you need a custom backend URL, add `VITE_BACKEND_URL` in a `.env` file.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint

## Notes

- Start the backend before using the app locally.
- Production should use a real backend URL and secure environment variables.
