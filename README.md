# BeyondChats - Gmail Integration Dashboard

A production-quality Gmail integration dashboard that lets users connect their Gmail account, sync emails, and view/reply to threads in a modern chat-style interface.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌──────────────┐
│   React (Vite)  │─────▶│   Laravel API   │─────▶│  Google APIs  │
│   TailwindCSS   │◀─────│   (REST/JSON)   │◀─────│  Gmail OAuth  │
│   React Query   │      │   Queue Jobs    │      │  Gmail API    │
└─────────────────┘      └────────┬────────┘      └──────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     MySQL DB     │
                         │  Users, Emails,  │
                         │  Attachments     │
                         └─────────────────┘
```

### Data Flow

```
User clicks "Connect Gmail"
  → Frontend calls POST /api/connect-gmail
  → Laravel returns Google OAuth URL
  → User authorizes on Google
  → Google redirects to GET /api/gmail-callback
  → Laravel stores tokens, redirects to frontend

User clicks "Sync Emails" (7/15/30 days)
  → Frontend calls POST /api/sync-emails
  → Laravel dispatches SyncEmailsJob (background)
  → Job fetches all messages via Gmail API
  → Messages parsed and stored in MySQL
  → Frontend polls GET /api/sync-status for progress

User views threads
  → Frontend calls GET /api/emails (thread list)
  → Frontend calls GET /api/email-thread/{id} (messages)
  → AI Summary generated client-side (heuristic)

User replies
  → Frontend calls POST /api/reply-email
  → Laravel sends via Gmail API preserving thread ID
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript, Vite 7 |
| Styling | TailwindCSS v4 |
| State | React Query (TanStack) |
| HTTP | Axios |
| Backend | Laravel 11 (PHP 8.1+) |
| Database | MySQL 8 |
| Auth | Google OAuth 2.0 |
| Queue | Laravel Jobs (database driver) |
| AI Feature | Frontend heuristic analysis |

---

## 📁 Project Structure

```
gobeyond/
├── frontend/                    # React + Vite application
│   └── src/
│       ├── components/
│       │   ├── Sidebar.tsx        # Navigation sidebar
│       │   ├── ThreadList.tsx     # Email thread list
│       │   ├── EmailThread.tsx    # Conversation view
│       │   ├── EmailReplyBox.tsx  # Reply textarea
│       │   ├── SyncModal.tsx      # Sync options modal
│       │   ├── SkeletonLoader.tsx # Loading skeletons
│       │   └── AISummary.tsx      # AI thread summary
│       ├── pages/
│       │   ├── Dashboard.tsx      # Overview page
│       │   ├── Integrations.tsx   # Gmail connect flow
│       │   └── Chats.tsx          # Thread viewer
│       ├── hooks/
│       │   ├── useEmails.ts       # Email query hooks
│       │   └── useSyncEmails.ts   # Sync mutation hooks
│       ├── services/
│       │   ├── api.ts             # Axios instance
│       │   └── gmailService.ts    # API wrappers
│       └── index.css              # TailwindCSS theme
│
├── backend/                     # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── GmailController.php   # OAuth + sync
│   │   │   └── EmailController.php   # Emails + reply
│   │   ├── Services/
│   │   │   ├── GmailService.php      # Gmail API wrapper
│   │   │   └── EmailSyncService.php  # Email parser
│   │   ├── Jobs/
│   │   │   └── SyncEmailsJob.php     # Background sync
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Email.php
│   │       └── Attachment.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── config/
│       ├── services.php          # Google credentials
│       └── cors.php              # CORS for frontend
│
└── README.md
```

---

## ⚡ Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **PHP** 8.1+ and Composer
- **MySQL** 8.0+
- **Google Cloud** project with Gmail API enabled

### 1. Clone the repository

```bash
git clone <repo-url>
cd gobeyond
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 3. Backend Setup

```bash
cd backend
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Start the server
php artisan serve
```

Backend runs at `http://localhost:8000`

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Gmail API**
4. Create OAuth 2.0 credentials (Web application)
5. Set redirect URI: `http://localhost:8000/api/gmail-callback`
6. Copy Client ID and Secret to `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 5. Run Queue Worker (for email sync)

```bash
php artisan queue:work
```

---

## 🔑 Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/gmail-callback

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beyondchats
DB_USERNAME=root
DB_PASSWORD=

# App
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Queue
QUEUE_CONNECTION=database
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connect-gmail` | Get Google OAuth URL |
| GET | `/api/gmail-callback` | OAuth callback handler |
| GET | `/api/auth-status` | Check connection status |
| POST | `/api/sync-emails` | Trigger email sync (body: `{ days: 7\|15\|30 }`) |
| GET | `/api/sync-status` | Get sync job progress |
| GET | `/api/emails` | List email threads |
| GET | `/api/email-thread/{id}` | Get thread messages |
| POST | `/api/reply-email` | Reply to thread (body: `{ thread_id, body }`) |

---

## ✨ Features

- **Gmail OAuth** — Secure Google sign-in with read + send scopes
- **Email Sync** — Background job syncs 7/15/30 days of history
- **Thread View** — Chat-style conversation UI with HTML rendering
- **Reply** — Send replies directly, preserving thread context
- **AI Summary** — Auto-generated thread summary + smart replies
- **Responsive** — Mobile-first design (375px → 1280px+)
- **Modern UI** — Indigo theme, glassmorphism, smooth animations

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| 375px (mobile) | Sidebar hidden, single-panel thread list/conversation |
| 768px (tablet) | Sidebar toggle, single-panel with back button |
| 1280px (desktop) | Fixed sidebar, two-panel thread list + conversation |

---

## 🤖 AI Feature

The AI Summary uses client-side heuristic analysis:

- **Thread Summary**: Extracts participant names, subject, and last message opener
- **Smart Replies**: Keyword-based suggestions (meeting, question, thanks, etc.)

No external AI API key required — works entirely offline.

---

## 📄 License

This project was built as a technical assignment for BeyondChats.
