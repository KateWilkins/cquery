# Agent Instructions for cquery

This file contains guidelines for AI coding agents working on the cquery project. Follow these instructions to maintain consistency and quality.

## Project Overview

cquery is a React-based web application for querying the Cognee search API. It features a chat interface with configurable settings and uses a proxy backend to communicate with the Cognee service.

**Tech Stack:**
- Frontend: React 19, Vite, Tailwind CSS, DaisyUI
- Backend: Express.js, Node.js
- Linting: ESLint with React hooks and refresh plugins

## Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start Vite dev server (port 5173)
```

### Building
```bash
npm run build        # Build for production to dist/
npm run preview      # Preview production build locally
```

### Linting
```bash
npm run lint         # Run ESLint on all JS/JSX files
```

### Production
```bash
npm run start        # Build and start production server (port 8200)
```

### Testing
**Note:** No test framework is currently configured. If adding tests:
- Install a testing framework like Vitest or Jest
- Add test scripts to package.json
- Run single tests with: `npm test -- path/to/test.file`

## Code Style Guidelines

### File Structure
```
src/
├── components/      # React components (.jsx)
├── assets/          # Static assets
├── App.jsx          # Main app component
├── main.jsx         # Entry point
├── config.js        # Configuration utilities
└── index.css        # Global styles

server.js            # Express backend
dist/               # Built files (gitignored)
```

### Imports and Exports
- Use ES6 imports/exports
- Group imports: React/React-DOM, external libraries, local modules
- Use named exports for utilities, default for components

```javascript
// Good
import { useState, useEffect } from 'react'
import axios from 'axios'
import MessageBox from './components/MessageBox'
import { loadConfig } from './config'

// Bad - mixed grouping
import MessageBox from './components/MessageBox'
import { useState } from 'react'
import axios from 'axios'
```

### React Components
- Use functional components with hooks
- Use arrow functions
- PascalCase for component names
- Destructure props in function parameters

```jsx
// Good
export default function MessageBox({ query, response }) {
  return (
    <div className="mb-4">
      {/* component body */}
    </div>
  )
}

// Bad - not destructuring
export default function MessageBox(props) {
  const { query, response } = props
  // ...
}
```

### Naming Conventions
- **Components:** PascalCase (e.g., `MessageBox`, `SettingsModal`)
- **Functions/Variables:** camelCase (e.g., `handleSubmit`, `isLoading`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DEFAULT_CONFIG`, `API_URL`)
- **Files:** PascalCase for components, camelCase for utilities
- **CSS Classes:** kebab-case in Tailwind (e.g., `chat-bubble-primary`)

### Styling
- Use Tailwind CSS utility classes
- Leverage DaisyUI components for consistent UI
- Avoid custom CSS unless necessary
- Use responsive design utilities (`sm:`, `md:`, `lg:`)

```jsx
// Good - DaisyUI + Tailwind
<div className="chat chat-start">
  <div className="chat-bubble chat-bubble-primary">
    {message}
  </div>
</div>

// Avoid custom styles unless DaisyUI doesn't provide
```

### State Management
- Use React hooks (`useState`, `useEffect`, `useRef`)
- Keep state local when possible
- Use descriptive state variable names

```javascript
// Good
const [messages, setMessages] = useState([])
const [isLoading, setIsLoading] = useState(false)
const messagesEndRef = useRef(null)

// Bad - unclear names
const [data, setData] = useState([])
const [flag, setFlag] = useState(false)
```

### Error Handling
- Use try/catch for async operations
- Log errors to console for debugging
- Show user-friendly error messages
- Handle loading states appropriately

```javascript
const handleSubmit = async (prompt) => {
  setLoading(true)
  try {
    const response = await axios.post('/api/search', { prompt })
    setMessages([...messages, response.data])
  } catch (error) {
    console.error('API Error:', error)
    setMessages([...messages, { error: 'Failed to get response' }])
  } finally {
    setLoading(false)
  }
}
```

### API Calls
- Use axios for HTTP requests
- Include error handling and loading states
- Log requests/responses for debugging
- Use relative URLs for backend proxy calls

```javascript
// Good
const response = await axios.post('/api/v1/search', payload)
console.log('Response:', response.data)

// Backend handles proxying to external service
```

### Configuration
- Use localStorage for client-side config
- Provide default values
- Validate config before use

```javascript
const defaultConfig = {
  serverUrl: 'http://localhost:8000',
  dataset: 'default-dataset-id',
  systemPrompt: 'You are a helpful assistant.'
}

export const loadConfig = () => {
  const stored = localStorage.getItem(CONFIG_KEY)
  return stored ? JSON.parse(stored) : defaultConfig
}
```

### Backend (server.js)
- Use ES6 imports
- Enable CORS for development
- Log requests/responses
- Proxy API calls to external services
- Serve static files in production

```javascript
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// API proxy endpoint
app.post('/api/v1/search', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/search', req.body)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

### Linting Rules
- Follow ESLint recommendations
- React hooks rules enabled
- Unused vars ignored if they match `/^[A-Z_]/` (constants)
- No semicolons (Prettier-like formatting)

### Performance
- Use React.memo for expensive components if needed
- Optimize re-renders with proper dependency arrays
- Use useCallback for event handlers passed to children
- Auto-scroll behavior for chat interfaces

### Security
- Never commit secrets or API keys
- Validate user inputs
- Use HTTPS in production
- Backend proxies external APIs to avoid CORS issues

### Git Workflow
- Follow conventional commit messages
- Test builds before committing
- Run lint before pushing
- Keep dist/ out of version control

### Adding New Features
1. Plan component structure and data flow
2. Add to appropriate directories
3. Update imports and exports
4. Handle loading/error states
5. Test with `npm run dev`
6. Run `npm run lint` and fix issues
7. Test build with `npm run build`

### Debugging
- Use console.log for development debugging
- Check browser dev tools for React errors
- Verify API calls in network tab
- Test both development and production builds

Remember: This is a React frontend with Express proxy backend. Keep the architecture clean with clear separation between UI logic and API handling.</content>
<parameter name="filePath">/Users/lyra/projects/cquery/AGENTS.md