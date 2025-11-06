# Tech Stack

## Build System

- **Monorepo**: Turborepo for managing multiple packages
- **Package Manager**: pnpm with workspaces
- **Node Version**: >= 18.0.0

## Frontend (apps/web)

- **Framework**: Next.js 14 (App Router)
- **UI**: TailwindCSS, Headless UI, Heroicons
- **State Management**: Jotai
- **Web3**: ethers.js v6, WalletConnect
- **API Client**: Auto-generated from Swagger using openapi-typescript-codegen

## Backend (apps/api)

- **Runtime**: Node.js with Koa framework
- **Database**: PostgreSQL via Prisma (dual schema: web3cv, web3jobs)
- **Cache**: Redis (ioredis)
- **AI/ML**: 
  - OpenRouter for LLM calls
  - Langchain for orchestration
  - Pinecone for vector storage
  - Transformers.js for embeddings
- **Document Processing**: mammoth (DOCX), pdfjs-dist (PDF), tesseract.js (OCR)
- **API Docs**: Swagger/OpenAPI 3.0

## Shared Packages

- `packages/ui`: Shared React components
- `packages/web3-utils`: Web3 utility functions

## Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with TypeScript, React, and import plugins
- **Formatting**: Prettier (single quotes, 2 spaces, 100 char width, trailing commas)
- **Git Hooks**: Husky + lint-staged for pre-commit checks

## Common Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Build all packages
pnpm build

# Linting
pnpm lint
pnpm lint:fix

# Format code
pnpm format

# API-specific
cd apps/api
pnpm dev                    # Start API server
pnpm test                   # Run tests
pnpm generate-swagger       # Generate Swagger docs
pnpm prisma:generate:web3cv # Generate Prisma client

# Web-specific
cd apps/web
pnpm dev                    # Start Next.js dev server
pnpm generate-api           # Generate API client from Swagger
```

## Environment Variables

- API requires: `WEB3CV_DATABASE_URL`, `WEB3JOBS_DATABASE_URL`, `REDIS_URL`, `PINECONE_API_KEY`, `OPENROUTER_API_KEY`
- Web requires: API endpoint configuration
- See `.env.example` files in each app
