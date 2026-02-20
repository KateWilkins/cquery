# Architecture

## Overview

Cognee Viewer is a full-stack web application that provides a user-friendly interface for querying the Cognee search API. It consists of a React-based frontend for the UI and an Express.js backend that acts as a proxy to the Cognee service, ensuring clean separation and security.

## Components

### Frontend (React + Vite)

- **Framework**: React 19 with Vite for fast development and building.
- **Styling**: Tailwind CSS with DaisyUI components for responsive design.
- **Features**:
  - Chat interface for queries and responses.
  - Settings modal for configuration.
  - Loading states and auto-focus management.
  - Auto-scrolling message view.

### Backend (Express.js)

- **Framework**: Express.js with CORS support.
- **Role**: Proxies API requests to Cognee, logs requests/responses, serves static files for production.
- **Endpoints**:
  - `POST /api/v1/search`: Receives search payloads from frontend and forwards to Cognee.

### External Dependencies

- **Cognee API**: Third-party search service running on `http://localhost:8000/api/v1/search`.
- **Local Storage**: For persisting user configuration (server URL, dataset, system prompt).

## Data Flow

```
User Input (React UI)
    ↓
PromptInput Component
    ↓
App.jsx handleSubmit
    ↓
Axios POST to /api/v1/search (relative URL)
    ↓
Express Backend (/api/v1/search)
    ↓
Axios POST to Cognee API (http://localhost:8000/api/v1/search)
    ↓
Cognee Response
    ↓
Express Backend
    ↓
JSON Response to Frontend
    ↓
Update Messages State
    ↓
Render MessageBox Components
```

## Architecture Diagram

```
+-------------------+       +-------------------+       +-------------------+
|   React Frontend  |       |  Express Backend  |       |   Cognee API      |
|   (Port 5173 dev) |       |   (Port 8200)     |       | (Port 8000)       |
|                   |       |                   |       |                   |
| - App.jsx         |       | - server.js       |       | - /api/v1/search  |
| - Components      |       | - Proxy Logic     |       |                   |
| - Config Mgmt     |       | - Static Serving  |       |                   |
| - UI/UX Logic     |       | - Logging         |       |                   |
+-------------------+       +-------------------+       +-------------------+
         |                           |                           |
         | HTTP POST /api/v1/search  | HTTP POST /api/v1/search  |
         | (relative, proxied)       | (forwarded with payload)  |
         +-------------------------->+--------------------------)+
         |                           |                           |
         | JSON Response             | JSON Response             |
         +<--------------------------+<--------------------------+
```

## Security Considerations

- Backend validates and forwards requests without exposing Cognee directly to the frontend.
- CORS enabled for development; in production, configure appropriately.
- No sensitive data stored; configuration is client-side only.

## Deployment

- **Development**: Separate processes for frontend (Vite) and backend (Node).
- **Production**: Single process serving built static files and API from Express.

## Future Enhancements

- Add authentication for user sessions.
- Implement caching for responses.
- Support multiple datasets and advanced query options.