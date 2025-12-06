# TaskFlow Pro

A high-performance, polished To-Do application built with React and Tailwind CSS. This project demonstrates modern frontend development practices including state management, TypeScript integration, and responsive UI design.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete tasks seamlessly.
- **Priority Management**: Assign and visualize priorities (High, Medium, Low) with distinct color coding.
- **Advanced Filtering**: 
  - Search tasks by title or description.
  - Filter by status (Active/Completed).
  - Filter by priority level.
- **Smart Sorting**: Sort tasks by Creation Date, Due Date, or Priority (High to Low).
- **Responsive Design**: Fully mobile-responsive layout with a mobile-first approach.
- **Data Persistence**: Uses `localStorage` to save your tasks between sessions (Mock Backend Service).
- **UX Polish**: Loading states, empty states, confirmation dialogs, and smooth transitions.

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS (via CDN for portability)
- **Language**: TypeScript
- **Icons**: Lucide React
- **State**: React Hooks (useState, useEffect, useCallback)

## Getting Started

Since this project uses ES Modules and `importmap` for dependencies, it requires a local static server to avoid CORS issues with file protocols.

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, Safari).
- A local static server (e.g., VS Code Live Server, `npx serve`, or Python `http.server`).

### Running Locally

1. **Clone the repository** (or download the files).
   ```bash
   git clone <repository-url>
   cd taskflow-pro
   ```

2. **Serve the project**:
   
   *Option A: Using Python*
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

   *Option B: Using Node.js (npx)*
   ```bash
   npx serve .
   ```

   *Option C: VS Code*
   Install the "Live Server" extension, right-click `index.html`, and select "Open with Live Server".

## Project Structure

- `index.html`: Entry point, Tailwind config, and Import Maps.
- `index.tsx`: React root mounting.
- `App.tsx`: Main application layout and state container.
- `types.ts`: TypeScript interfaces and Enums.
- `services/`: Contains `taskService.ts` which handles data logic and LocalStorage.
- `components/`: Reusable UI components (TaskItem, TaskForm, FilterBar, Modal, Button).

## License

MIT
