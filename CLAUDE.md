# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive Things 3 clone that combines elegant individual productivity with modern collaborative features. The project is currently at the Create React App foundation stage but has extensive planning documentation for a sophisticated task management application.

## Commands

### Development
- `npm start` - Start development server on http://localhost:3000
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Create production build in `build/` folder

### Testing
- Tests use Jest and React Testing Library
- Test files follow pattern `*.test.js`
- Run a single test file: `npm test -- App.test.js`
- Run tests with coverage: `npm test -- --coverage`

## Current Architecture

**Current State**: Fresh Create React App installation with React 19.1.0
- **src/** - All application code (currently CRA boilerplate)
  - `index.js` - Application entry point with React.StrictMode
  - `App.js` - Main component (currently default CRA content)
  - Single test in `App.test.js` (passing)

**Planned Architecture**: Reference `/documentation/app-template.md` for comprehensive technical specification
- **Frontend**: React + TypeScript, Tailwind CSS, Redux Toolkit, @dnd-kit
- **Backend**: C# .NET 8+, Entity Framework Core, PostgreSQL on Supabase
- **Real-time**: Supabase Realtime for collaboration features
- **Design**: Complete design system in `/documentation/design/things3-design-system.json`

## Key Documentation

### Planning Documents
- **`/documentation/master-prd.md`** - Complete product requirements (530 lines)
- **`/documentation/design/complete-app-template.md`** - Full technical implementation guide
- **`/documentation/design/things3-design-system.json`** - Comprehensive design system specification

### Design Assets
- **`/documentation/design/`** - Contains Things 3 UI screenshots and design analysis
- Color palette, component styles, interaction patterns all documented

## Development Patterns

### Current Implementation
1. **Component Pattern**: Functional components with hooks (established in App.js)
2. **Testing**: React Testing Library setup working
3. **Styling**: CSS imports (current App.css pattern)
4. **ES6 Modules**: Standard import/export pattern

### Planned Implementation (from app-template.md)
1. **Component Structure**: Layout → Task → Collaboration component hierarchy
2. **State Management**: Redux Toolkit for global state, React Query for server state
3. **Real-time Features**: Supabase WebSocket integration for collaboration
4. **Design System**: Things 3-inspired color palette and component styling

## Development Workflow

### Current Workflow
1. `npm test` - Ensure tests pass (currently 1 test passing)
2. `npm start` - Development server works correctly
3. `npm run build` - Production build verified working

### Feature Development Process
1. Reference `/documentation/app-template.md` for implementation patterns
2. Use design system from `/documentation/design/things3-design-system.json`
3. Follow component architecture outlined in documentation
4. Maintain test coverage with React Testing Library
5. Run `npm run build` to verify production builds

## Key Implementation Notes

- **Design Fidelity**: Must match Things 3's "invisible interface" philosophy
- **Collaboration First**: All features designed for both individual and team use
- **Performance**: Target <1s load time, <200ms real-time sync
- **Testing**: 100% test coverage requirement per user instructions