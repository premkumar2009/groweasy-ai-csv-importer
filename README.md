# GrowEasy AI CSV Importer

Production-ready monorepo for importing arbitrary CSV files into CRM-ready records using Gemini-assisted field mapping.

## Project Overview

This workspace contains two deployable applications:

- `frontend/` - Next.js 15 App Router UI for CSV upload, preview, confirmation, and results
- `backend/` - Express API that validates CSV files, batches rows, maps them with Gemini, and returns structured CRM records

## Features

- Drag-and-drop CSV upload
- File type and empty-file validation
- CSV preview before import
- AI-assisted mapping of unknown column structures
- Batch processing with retries
- Structured JSON response for imported and skipped rows
- Responsive dashboard UI with dark mode toggle
- Loading overlays, skeletons, and toast notifications
- Production-ready Docker and deployment configuration

## Architecture

The backend follows a clean architecture split:

- `controllers/` - HTTP request handlers
- `routes/` - Express route definitions
- `services/` - CSV parsing, Gemini mapping, and import orchestration
- `middlewares/` - upload, validation, and error handling
- `utils/` - shared helpers
- `prompts/` - reusable Gemini prompt content
- `types/` - shared type definitions

The frontend keeps feature logic in reusable components and service modules, using TanStack Table for both preview and results views.

## Installation

### Prerequisites

- Node.js 20+
- npm 10+
- Gemini API key

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

```env
PORT=5000
GEMINI_API_KEY=your_key_here
CORS_ORIGIN=http://localhost:3000
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Documentation

### `GET /health`

Response:

```json
{ "status": "ok" }
```

### `POST /api/import`

Accepts `multipart/form-data` with a `file` field containing a CSV.

Response:

```json
{
  "success": true,
  "totalImported": 45,
  "totalSkipped": 5,
  "records": []
}
```

## Folder Structure

```text
frontend/
backend/
.github/
```

## Deployment

### Frontend on Vercel

- Set `NEXT_PUBLIC_API_URL` to the deployed backend URL
- Deploy the `frontend/` directory as the project root

### Backend on Railway or Render

- Set `PORT`
- Set `GEMINI_API_KEY`
- Set `CORS_ORIGIN` to the deployed frontend URL
- Start command: `npm start`
- Build command: `npm run build`

## Screenshots

Add production screenshots here after deployment.

## Future Improvements

- Persist import history
- Add authentication and role-based access
- Add file storage and audit logs
- Add export and CRM sync integrations
- Add batch progress streaming over SSE/WebSockets
