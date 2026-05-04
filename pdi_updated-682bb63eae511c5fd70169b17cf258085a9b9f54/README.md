# Ekya PDIS - Professional Development Information System

A comprehensive platform for managing observations, tracking professional development, and empowering educators.

## 📁 Project Structure

```
pdi_updated/
│
├── frontend/                   # 🎨 FRONTEND WORKSPACE
│   ├── index.html              # Entry point HTML
│   ├── package.json            # Frontend dependencies & scripts
│   ├── vite.config.ts          # Vite dev server config
│   ├── tailwind.config.ts      # Tailwind CSS theme
│   ├── tsconfig.json           # TypeScript config (root)
│   ├── src/                    # Frontend React code
│   └── public/                 # Static assets
│
├── backend/                    # 🔧 BACKEND WORKSPACE
│   ├── package.json            # Backend dependencies
│   ├── tsconfig.json           # Backend TS config
│   ├── src/                    # API routes, controllers, services
│   ├── public/                 # Backend static files
│   ├── scripts/                # Backend utility scripts
│   ├── logs/                   # Backend error/debug logs
│   └── docs/                   # Backend-specific documentation
│
├── database/                   # �️ DATABASE WORKSPACE
│   ├── prisma/                 # Prisma schema & migrations
│   │   ├── schema.prisma       # Database schema
│   │   └── dev.db              # SQLite database (gitignored)
│   └── sql/                    # SQL seed & migration files
│
├── md/                         # 📚 PROJECT DOCUMENTATION (Markdown)
│   ├── ADMIN_DOCUMENT_MANAGEMENT.md
│   ├── BACKEND_ARCHITECTURE.md
│   ├── DEV_SERVER_CONFIG.md
│   ├── DOCUMENTS_PAGE_FIXED.md
│   ├── DOCUMENT_ACKNOWLEDGEMENT_SYSTEM.md
│   ├── FRONTEND_BACKEND_CONNECTION.md
│   ├── MANAGEMENT_DASHBOARD.md
│   ├── N8N_CONFIGURATION_PAGE_PLAN.md
│   ├── N8N_WORKFLOW_STRUCTURE.md
│   ├── PROJECT_HEALTH_CHECK.md
│   ├── QUICK_TEST_GUIDE.md
│   ├── SCHOOL_TEACHER_SELECTION.md
│   └── SUPERADMIN_ACCESS_ARCHITECTURE.md
│
├── scripts/                    # 🔨 UTILITY SCRIPTS
│   ├── n8n/                    # N8N workflow scripts & exports
│   ├── fix_leaders_dashboard*  # Dashboard fix scripts
│   ├── verify_*.ps1            # PowerShell verification scripts
│   └── test_api.cjs            # API test script
│
├── config/                     # ⚙️ DEPLOYMENT CONFIGS
│   ├── railway.json            # Railway deployment config
│   ├── render.yaml             # Render deployment config
│   └── render-build.sh         # Render build script
│
├── functions/                  # ☁️ SERVERLESS FUNCTIONS
│   └── api/                    # API endpoint functions
│
├── supabase/                   # 🗄️ SUPABASE CONFIG
│   └── config.toml             # Supabase configuration
│
├── archives/                   # 📦 ARCHIVED FILES
│   └── teacher_acknowledgement_system.zip
│
├── logs/                       # 📝 LOGS & TEMP OUTPUT (gitignored)
│
└── .opencode/                  # 🤖 AI TOOLS (gitignored)
    ├── agents/                 # GSD AI agents
    ├── command/                # GSD slash commands
    └── get-shit-done/          # GSD framework files
```

## 🚀 Quick Start

### Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev          # Starts on http://localhost:8080
```

### Backend (Express + Prisma)
```bash
cd backend
npm install
npx prisma generate --schema=../database/prisma/schema.prisma
npx ts-node --transpile-only src/index.ts   # Starts on http://localhost:4000
```

## 🛠️ Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling  | Tailwind CSS + Shadcn UI |
| Backend  | Express.js + TypeScript |
| Database | SQLite (Prisma ORM) |
| Auth     | JWT (jose) |
| Testing  | Vitest |