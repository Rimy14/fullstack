# TODO App - Frontend (React)

The frontend client for the TODO application, built with React and Vite.

## Tech Stack

- **Library**: React 19
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS (custom dark theme)
- **HTTP Client**: Fetch API

## Setup

### Prerequisites

- Node.js 18 or higher
- Backend server running on `http://localhost:5000`

### Installation

```bash
cd client
npm install
```

### Running the Dev Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
client/
├── public/
│   └── favicon.svg           # App favicon
├── src/
│   ├── components/
│   │   ├── ErrorBanner.jsx   # Dismissable error notification
│   │   ├── TodoForm.jsx      # New todo creation form
│   │   ├── TodoItem.jsx      # Individual todo card (view + edit mode)
│   │   └── TodoList.jsx      # Todo list with sections
│   ├── hooks/
│   │   └── useTodos.js       # Custom hook for todo state management
│   ├── services/
│   │   └── todoApi.js        # API service layer
│   ├── App.css               # Application styles
│   ├── App.jsx               # Root application component
│   ├── index.css             # Global base styles
│   └── main.jsx              # React entry point
├── index.html
├── package.json
└── README.md
```

## Features

### Core Functionality
- **View TODOs**: Displays all tasks, separated into Active and Completed sections
- **Create TODO**: Form with title (required) and description (optional) fields
- **Edit TODO**: Inline editing with keyboard shortcuts (Enter to save, Escape to cancel)
- **Toggle Done**: Click checkbox to mark as done/undone
- **Delete TODO**: Remove tasks with smooth exit animation

### UX Enhancements
- **Optimistic Updates**: UI updates immediately, rolls back on API error
- **Form Validation**: Client-side validation with character counters
- **Error Handling**: Dismissable error banners for API failures
- **Loading States**: Spinner during initial data fetch
- **Empty State**: Friendly message when no tasks exist
- **Animations**: Fade-in, slide-up, shake (errors), and slide-out (delete) animations
- **Responsive Design**: Mobile-optimized layout
- **Keyboard Shortcuts**: Enter to save edits, Escape to cancel
- **Visual Distinction**: Completed tasks shown with strikethrough and reduced opacity

### Design
- Premium dark theme with glassmorphism
- Animated gradient background orbs
- Inter font family
- Custom SVG icons (no icon library dependency)
- Hover-reveal action buttons

## API Configuration

The frontend connects to the backend API at `http://localhost:5000/api/todos`. 

To change the API URL, update the `API_BASE` constant in `src/services/todoApi.js`.

## Assumptions & Limitations

- Backend must be running on port 5000 for the app to work
- No client-side routing (single-page application)
- No state persistence (state comes entirely from the API)
- No authentication UI
