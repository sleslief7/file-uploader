# AI Coding Agent Instructions for File Uploader

## Project Architecture

This is a **full-stack TypeScript file management application** with a clear client-server separation:

- **Monorepo structure**: Uses `pnpm` workspace with `client/` and `server/` packages
- **Client**: React + Vite + Chakra UI v3 + TanStack Query + React Router
- **Server**: Express + Prisma + PostgreSQL + Passport.js + Supabase Storage
- **Development**: `pnpm dev` runs both client (port 5173) and server (port 3000) concurrently

## Critical Development Workflows

### Starting Development

```bash
# Root command runs both client and server
pnpm dev

# Individual services
pnpm --filter client dev    # Vite dev server
pnpm --filter server start:dev  # ts-node-dev with hot reload
```

### Database Operations

```bash
# In server directory
pnpm db:reset     # Reset and reseed database
pnpm db:seed      # Run seed scripts only
```

### Build Process

- **Client**: `tsc -b && vite build` (TypeScript check + Vite bundle)
- **Server**: `prisma migrate deploy && prisma generate && tsc`

## Key Architectural Patterns

### Backend Structure

- **Controllers**: Handle HTTP requests in `server/src/controllers/`
- **Services**: Business logic in `server/src/services/`
- **Routes**: Express routers in `server/src/routes/`
- **Authentication**: Passport.js with local + Google OAuth strategies
- **Storage**: Supabase for file storage, abstraced through `server/src/storage/supabase.ts`
- **Database**: Prisma ORM with generated client in `server/generated/prisma/`

### Frontend Structure

- **State Management**: TanStack Query for server state, React Context for auth
- **UI**: Chakra UI v3 with custom theme in `src/theme.ts`
- **API Layer**: Centralized axios client in `src/api/apiClient.ts` with `withCredentials: true`
- **Routing**: React Router with protected routes based on auth context
- **Forms**: React Hook Form + Zod validation

### Authentication Flow

- **Session-based**: Express sessions stored in PostgreSQL via Prisma
- **Context Pattern**: `AuthContext` provides `isAuth` and `user` throughout app
- **Protection**: Auth state drives conditional navbar rendering and route access

## Project-Specific Conventions

### File Organization

- **Interfaces**: Shared TypeScript types in `client/src/interfaces/`
- **Hooks**: Custom hooks prefixed with `use` in `client/src/hooks/`
- **API Functions**: One file per resource (`authApi.ts`, `fileApi.ts`, etc.)

### Database Schema

- **Hierarchical Structure**: Files and folders with parent-child relationships
- **User Ownership**: All entities linked to `User` via foreign keys
- **Soft Deletes**: Use Prisma's update patterns, not actual deletion for files

### Error Handling

- **Server**: Custom error middleware in `server/src/middleware/errorMiddleware.ts`
- **Client**: TanStack Query handles API errors, toast notifications for user feedback

### Environment Configuration

- **Development**: Client expects API at `http://localhost:3000`
- **CORS**: Configured for credentials in server with client URL whitelist
- **Supabase**: File storage requires `SUPABASE_URL`, `SUPABASE_ANON_KEY`, bucket names

## Integration Points

### File Upload Flow

1. **Client**: Multipart form via `UploadFileContainer.tsx`
2. **Server**: Multer middleware → Supabase storage → Prisma database record
3. **Response**: Database record with Supabase file path

### Data Fetching Pattern

- **TanStack Query**: All server state with automatic caching/refetching
- **Custom Hooks**: `useItems.tsx`, `useFolderTree.tsx` encapsulate query logic
- **Optimistic Updates**: Manual cache updates after mutations

### Authentication Integration

- **Passport Strategies**: Local (email/password) + Google OAuth in `server/src/auth/`
- **Session Storage**: Prisma-backed session store for persistence
- **Client Detection**: `useCheckAuth.tsx` hook validates session on mount

## Development Commands You'll Need

```bash
# Chakra UI theme type generation
pnpm --filter client chakra:theming

# Database migrations
pnpm --filter server build  # Includes migrate + generate

# Debugging
# Server runs with --inspect=9229 for Node.js debugging
# Client has source maps enabled in Vite config
```

## Common Gotchas

- **Prisma Client**: Generated in `server/generated/prisma/`, not default location
- **Path Resolution**: Client uses Vite tsconfig paths for `@/` imports
- **CORS**: Credentials must be enabled for session-based auth
- **File Paths**: Supabase storage paths must be managed carefully in move/copy operations
