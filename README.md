# BeyondChats — Frontend UI

A highly responsive, chat-like email client interface designed for seamless Gmail integration. Built with modern web standards, it delivers a polished, premium user experience with real-time UI updates, optimistic rendering, and a glassmorphic aesthetic.

## 🚀 Tech Stack

- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **State Management**: React Query (TanStack V5)
- **Routing**: React Router v7
- **Utilities**: DOMPurify (XSS prevention), Day.js (Date formatting), Sonner (Toast notifications)

## 🏗️ Architecture

The frontend is structured to enforce a strict separation of concerns, maintaining scalability and readability:

- **`/src/components`**: Highly granular, reusable presentational components (e.g., SkeletonLoaders, Chat bubbles).
- **`/src/context`**: Global application state, including `AuthContext` for managing the Google OAuth workflow.
- **`/src/hooks`**: Custom React Query hooks pulling from our API layer (`useEmails`, `useSyncStatus`), encapsulating backend complexity.
- **`/src/layout`**: Application shell components managing responsive collapsing sidebars, global modals, and dynamic headers.
- **`/src/pages`**: Top-level route views assembling the components (Dashboard, Integrations, Chats).
- **`/src/services`**: Axios interceptors and strictly typed API endpoint wrappers.

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure the environment by duplicating the example `.env` file (if applicable) and explicitly setting the backend URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
3. Boot the development environment:
   ```bash
   npm run dev
   ```

## 🛠️ Scripts

- `npm run dev`: Bootstraps the local Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Type-checks the application (`tsc`) and generates a highly optimized, minified production bundle.
- `npm run preview`: Spins up a local web server to locally preview the production build generated in `/dist`.
