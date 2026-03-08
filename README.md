# BeyondChats UI

The frontend application for BeyondChats, built with React, Vite, and TailwindCSS.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Architecture Map

- \`src/components/\`: Shared UI components and layout pieces (Sidebar, Header).
- \`src/pages/\`: Top-level page components containing specific views (Dashboard, Integrations, Chats).
- \`src/hooks/\`: Custom React Query hooks (\`useEmails\`, \`useSyncStatus\`) interfacing with the Laravel backend.
- \`src/context/\`: Application-level context like the Auth Context.

## Scripts
- \`npm run dev\`: Starts the local Vite development server
- \`npm run build\`: Builds the production bundle
- \`npm run preview\`: Serves the built production bundle locally
