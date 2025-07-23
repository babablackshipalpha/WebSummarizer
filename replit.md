# SEO & GEO Audit Tool

## Overview

This is a full-stack web application that provides comprehensive SEO (Search Engine Optimization) and GEO (Generative Engine Optimization) auditing capabilities for websites. The application analyzes websites for both traditional Google SEO factors and AI platform visibility (ChatGPT, Perplexity, Claude, etc.), providing detailed reports with actionable recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and shared components:

- **Frontend**: React-based SPA with TypeScript, using Vite for build tooling
- **Backend**: Express.js server with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React with TypeScript**: Modern component-based architecture
- **shadcn/ui Components**: Comprehensive UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **TanStack Query**: Handles API calls, caching, and server state synchronization
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Form handling with Zod validation

### Backend Architecture
- **Express.js Server**: RESTful API with TypeScript
- **Service Layer**: Modular services for web scraping and SEO analysis
- **WebScraper Service**: Uses Cheerio for HTML parsing and content extraction
- **SeoAnalyzer Service**: Provides traditional SEO and GEO analysis capabilities
- **Storage Layer**: Abstracted storage interface with in-memory implementation

### Database Schema
- **PostgreSQL**: Primary database using Drizzle ORM
- **Audit Reports Table**: Stores website analysis results with JSON fields for complex data
- **Schema Validation**: Drizzle-Zod integration for type-safe database operations

## Data Flow

1. **User Input**: Users submit URLs through the frontend form with analysis options
2. **Web Scraping**: Backend scrapes the target website to extract content and metadata
3. **Analysis Processing**: Multiple analysis engines process the scraped data:
   - Traditional SEO analysis (title tags, meta descriptions, headings, etc.)
   - GEO analysis (AI-friendly content structure, semantic clarity)
   - Content suggestions generation
4. **Report Generation**: Results are compiled into a comprehensive audit report
5. **Data Persistence**: Reports are stored in PostgreSQL for future reference
6. **Frontend Display**: Results are presented through interactive UI components

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL driver for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **cheerio**: Server-side HTML parsing and manipulation
- **@radix-ui/***: Headless UI primitives for accessibility
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast JavaScript bundler for production builds

### External Services Integration
- **Web Scraping**: Direct HTTP requests to target websites
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: Backend API server with automatic restarts
- **TypeScript Compilation**: Real-time type checking and compilation
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: PostgreSQL with connection pooling through Neon
- **Static Serving**: Express serves built frontend assets in production

### Key Architectural Decisions

1. **Monorepo Structure**: Shared schema and types between frontend and backend for consistency
2. **In-Memory Storage Fallback**: Provides development flexibility while supporting PostgreSQL in production
3. **Service-Oriented Backend**: Modular services allow for easy testing and maintenance
4. **Type-Safe Database Layer**: Drizzle ORM with Zod validation ensures data integrity
5. **Component-First Frontend**: shadcn/ui provides consistent, accessible UI components
6. **Optimistic UI Updates**: TanStack Query handles loading states and error recovery
7. **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

The application is designed to be scalable, maintainable, and provide a smooth user experience for website SEO auditing across both traditional search engines and modern AI platforms.