# TODO App - Full Stack Application

A modern, full-stack TODO application built with **React** (frontend) and **Express.js** (backend), using **MongoDB** for data persistence.

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React 19 (Vite)             |
| Backend    | Node.js + Express.js        |
| Database   | MongoDB + Mongoose          |
| Styling    | Vanilla CSS (Custom Design) |

## Project Structure

```
hiring-fullstack-todo/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # TodoForm, TodoItem, TodoList, ErrorBanner
│   │   ├── hooks/       # useTodos custom hook
│   │   ├── services/    # API service layer
│   │   ├── App.jsx      # Main application component
│   │   └── App.css      # Application styles
│   ├── package.json
│   └── README.md
├── server/              # Express.js backend
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── server.js        # Entry point
│   ├── package.json
│   └── README.md
├── package.json         # Monorepo scripts
└── README.md            # This file
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local instance or MongoDB Atlas)

### Installation

```bash
# Install all dependencies (root, client, server)
npm install
npm run install:all
```

### Running the Application

```bash
# Start both frontend and backend concurrently
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/todos

### Running Individually

```bash
# Start the backend server
npm run dev:server

# Start the frontend dev server
npm run dev:client
```

## Features

- ✅ View all TODO items
- ✅ Create a TODO with title and optional description
- ✅ Edit a TODO's title and description (inline editing)
- ✅ Toggle done/undone status
- ✅ Delete a TODO
- ✅ Form validation (client-side and server-side)
- ✅ Optimistic UI updates with rollback on error
- ✅ Loading and error states
- ✅ Smooth animations and transitions
- ✅ Responsive design
- ✅ Keyboard shortcuts (Enter to save, Escape to cancel)

## API Endpoints

| Method | Endpoint            | Description                       |
|--------|---------------------|-----------------------------------|
| GET    | /api/todos          | Get all TODO items                |
| POST   | /api/todos          | Create a new TODO item            |
| PUT    | /api/todos/:id      | Update a TODO (title/description) |
| PATCH  | /api/todos/:id/done | Toggle the done status            |
| DELETE | /api/todos/:id      | Delete a TODO                     |

## Architecture Decisions

1. **Monorepo with npm scripts** - Simple approach using `concurrently` to run both services, avoiding complex monorepo tooling overhead for a single-service app.

2. **Custom React Hook (`useTodos`)** - Centralizes all state management and API communication, implementing optimistic updates with automatic rollback on failure.

3. **Controller-Route-Model pattern** - Clean separation of concerns in the backend following Express.js best practices.

4. **Vanilla CSS with CSS custom properties** - Premium dark theme with glassmorphism effects, avoiding utility-class overhead while maintaining full design control.

5. **Client + Server validation** - Dual-layer validation ensures data integrity regardless of the request source.
