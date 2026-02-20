# Cognee Viewer

A React-based web application for querying and visualizing responses from the Cognee search API. Features a chat-like interface for sending prompts and receiving AI-generated answers, with configurable settings for dataset and system prompts.

## Features

- **Interactive Chat Interface**: Send queries and view responses in a conversational format.
- **Configurable Settings**: Adjust server URL, dataset ID, and system prompts via the settings modal.
- **Real-time Loading Indicators**: UI disables input and shows spinners during API calls.
- **Auto-scroll and Focus**: Automatically scrolls to new messages and refocuses input after responses.
- **Responsive Design**: Built with Tailwind CSS and DaisyUI for a clean, modern UI.

## Architecture

The application consists of a React frontend and an Express backend. See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

## Prerequisites

- Node.js (v18 or higher)
- Access to a running Cognee server (default: http://localhost:8000)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KateWilkins/cquery.git
   cd cquery
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure the Cognee server is running on `http://localhost:8000`.

## Usage

### Development

Run the frontend with hot reloading:
```bash
npm run dev
```

In a separate terminal, run the backend:
```bash
npm run server
```

Access the app at `http://localhost:5173`.

### Production

Build and serve the application:
```bash
npm run start
```

Access the app at `http://localhost:8200`.

## Configuration

- Open the settings modal (gear icon) to configure:
  - **Server URL**: Backend endpoint (not directly used in current setup).
  - **Dataset**: Cognee dataset ID.
  - **System Prompt**: Instructions for the AI assistant.

Settings are saved in localStorage.

## API

The backend exposes:
- `POST /api/v1/search`: Forwards search queries to Cognee.

## Technologies

- **Frontend**: React 19, Vite, Tailwind CSS, DaisyUI
- **Backend**: Express.js, Axios
- **Linting**: ESLint

## Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run server`: Start Express backend
- `npm run start`: Build and start production server
