# Rest Express - Order Queue Management System

## Overview

This is a full-stack web application built with React and Express.js that manages a food order queue system for students. The application allows staff to view, process, and track orders through different stages (received, preparing, ready). It features a clean, modern UI with real-time animations and responsive design.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Animations**: Framer Motion for smooth transitions and animations

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API design
- **Development**: Hot reload with tsx for development server
- **Build Process**: esbuild for production bundling

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Development Storage**: In-memory storage implementation for development
- **Migrations**: Drizzle migrations in `./migrations` directory
- **Schema**: Centralized schema definitions in `shared/schema.ts`

### Authentication and Authorization
- **Session Management**: PostgreSQL session store using `connect-pg-simple`
- Currently no authentication implemented (development phase)

## Key Components

### Database Schema
- **Orders Table**: Stores order information with fields:
  - `id`: UUID primary key
  - `studentName`: Student's name
  - `orderType`: Type of order (e.g., "Lanche", "Sobremesa")
  - `details`: Order description
  - `status`: Order status ("received", "preparing", "ready")
  - `createdAt`: Timestamp

### API Endpoints
- `GET /api/orders` - Retrieve all orders
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/next` - Move order to end of queue
- `PATCH /api/orders/:id/status` - Update order status

### Frontend Features
- **Order Queue Display**: Visual queue with color-coded status indicators
- **Real-time Updates**: Automatic data fetching with TanStack Query
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive Elements**: Buttons for processing orders and updating status
- **Animations**: Smooth transitions when orders change state

## Data Flow

1. **Order Creation**: New orders are submitted via POST API and stored in database
2. **Queue Display**: Frontend fetches orders via GET API and displays in queue format
3. **Order Processing**: Staff can move orders through pipeline using PATCH API
4. **State Updates**: TanStack Query automatically refetches data after mutations
5. **UI Updates**: Framer Motion provides smooth animations during state transitions

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive Radix UI component library
- **Forms**: React Hook Form with Zod validation resolvers
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for any carousel needs

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL adapter
- **Validation**: Zod for runtime type checking and validation
- **Session Storage**: PostgreSQL session store for user sessions

### Development Tools
- **Replit Integration**: Custom plugins for Replit development environment
- **Error Handling**: Runtime error overlay for development
- **Code Mapping**: Source map support for debugging

## Deployment Strategy

### Development
- Uses Vite dev server with HMR for frontend
- Express server with tsx for TypeScript execution
- In-memory storage for quick development iteration

### Production Build
1. Frontend: Vite builds optimized static assets to `dist/public`
2. Backend: esbuild bundles server code to `dist/index.js`
3. Database: Drizzle migrations ensure schema consistency
4. Serving: Express serves both API and static frontend files

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required for production)
- `NODE_ENV`: Environment detection for conditional features
- Session configuration for production security

### Key Architectural Decisions

**Monorepo Structure**: Single repository with client, server, and shared directories for better code organization and type sharing.

**Shared Schema**: Database schema and TypeScript types are defined once in `shared/` and used by both frontend and backend, ensuring type safety across the stack.

**In-Memory Development Storage**: Allows rapid development without database setup, with easy switch to PostgreSQL for production.

**Component-First UI**: Uses Shadcn/ui for consistent, accessible components with full customization control.

**Type-Safe API**: Zod schemas validate API requests and responses, providing runtime safety and better developer experience.