# Project Structure

## Monorepo Layout

```
block-recruit/
├── apps/
│   ├── api/          # Backend Koa API server
│   └── web/          # Frontend Next.js application
├── packages/
│   ├── ui/           # Shared React components
│   └── web3-utils/   # Web3 utility functions
├── prisma/           # Database schemas (web3cv, web3jobs)
├── docs/             # Product documentation (Chinese)
└── scripts/          # Build and utility scripts
```

## Backend Structure (apps/api/src)

```
src/
├── controllers/      # Request handlers (users, jobs, resumes, applications, nft)
├── routes/          # Koa route definitions with Swagger annotations
├── services/        # Business logic
│   ├── ai/          # AI service for resume/job analysis
│   └── rag/         # RAG pipeline (embedding, extraction, Pinecone, smart filtering)
├── models/          # Data models and validation
├── middleware/      # JWT auth, admin checks
├── prisma/          # Generated Prisma clients (web3cv, web3jobs)
├── utils/           # Redis, scoring utilities
├── test/            # Test files and mocks
└── index.ts         # App entry point
```

## Frontend Structure (apps/web)

```
app/                 # Next.js App Router
├── jobs/           # Job listing pages
├── resume/         # Resume pages
│   └── [id]/       # Dynamic resume detail
├── layout.tsx      # Root layout
└── page.tsx        # Home page

lib/                # Utilities and configs
services/           # API client (auto-generated)
store/              # Jotai atoms for state
utils/              # Helper functions
```

## Key Conventions

- **Dual Database**: Separate Prisma schemas for CV data (web3cv) and job data (web3jobs)
- **API Generation**: Backend generates Swagger → Frontend auto-generates TypeScript client
- **Path Aliases**: Use `@/*` for imports in both apps
- **Module System**: API uses ES modules (NodeNext), requires `.js` extensions in imports even for `.ts` files
- **Testing**: Jest for API, test files in `__tests__` or `*.test.ts`
- **Authentication**: JWT-based with wallet address as identifier
- **Vector Storage**: Pinecone indexes for resume and job embeddings with metadata filtering
