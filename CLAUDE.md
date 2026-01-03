# Office Chore Manager

## Overview
A client-side React application for managing team chores with calendar integration and recurring task support. All data persists in browser localStorage—no backend required.

## Purpose
Helps small teams coordinate and track shared responsibilities through an interactive calendar interface with weekly recurring chore patterns and team member assignments.

## Tech Stack

### Core
- **React 19.0.2** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool and dev server

### Key Dependencies
- **react-big-calendar 1.19.4** - Interactive calendar views (month/week/day)
- **date-fns 4.1.0** - Date manipulation and formatting

### Development
- **ESLint 9.39.1** - Code linting with TypeScript and React Hooks rules
- **TypeScript ESLint** - Type-aware static analysis

## Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── Calendar/        # Calendar view integration (CalendarView.tsx:1)
│   ├── ChoreForm/       # Chore creation/editing forms (ChoreForm.tsx:1)
│   ├── ChoreDetails/    # Chore detail modal (ChoreModal.tsx:1)
│   └── TeamManagement/  # Team member CRUD UI (TeamList.tsx:1)
├── hooks/               # Custom React hooks for data management
│   ├── useChores.ts     # Chore CRUD + recurrence logic
│   ├── useTeamMembers.ts # Team member CRUD
│   └── useLocalStorage.ts # Persistent state with auto-save
├── utils/               # Business logic utilities
│   ├── recurrence.ts    # Weekly recurrence generation
│   ├── storage.ts       # localStorage abstraction
│   └── dateHelpers.ts   # Date formatting and ID generation
├── types/
│   └── index.ts         # TypeScript interfaces for all entities
└── App.tsx              # Main component - state orchestration
```

### Directory Purposes

**components/** - UI components following modal-based architecture. Each feature has its own subdirectory with component file and CSS module.

**hooks/** - Custom hooks encapsulating data operations. `useChores` and `useTeamMembers` provide CRUD APIs; `useLocalStorage` handles persistence.

**utils/** - Pure functions for business logic. `recurrence.ts:11` generates recurring chore instances; `storage.ts:4` provides localStorage error handling.

**types/** - Centralized TypeScript definitions. Core interfaces: `Chore`, `RecurrencePattern`, `ChoreCompletion`, `TeamMember`, `CalendarEvent` (types/index.ts:1-58).

## Essential Commands

```bash
# Start development server with HMR at http://localhost:5173
npm run dev

# Type check and build for production (output: dist/)
npm run build

# Run ESLint on all TypeScript/React files
npm run lint

# Preview production build locally
npm run preview
```

## Core Features

### Chore Management
- Create/edit/delete chores with title, date, description, assignees
- One-time or recurring (weekly) chores
- Mark instances complete/incomplete
- Visual status indicators: blue (unassigned), orange (assigned), green (complete)

### Recurring Chores
- Weekly patterns with day-of-week selection (src/types/index.ts:16-21)
- Optional start/end date boundaries
- Parent-instance model: parent stores rules, instances generated dynamically
- Per-instance completion tracking (src/types/index.ts:23-27)

### Calendar Integration
- Month/week/day views via react-big-calendar
- Click slots to create chores
- Click events to view/edit details
- Chore filtering and instance generation (src/App.tsx:65-127)

### Team Management
- Add/remove team members
- Duplicate prevention (case-insensitive)
- Multi-member chore assignments

## Data Persistence

All data stored in browser localStorage:
- **Key: `chore-app-chores`** - Array of Chore objects
- **Key: `chore-app-team-members`** - Array of TeamMember objects

No backend, no authentication. Data scoped to browser/device.

## Key Architectural Decisions

- **No external state management** - React hooks + localStorage sufficient for scope
- **Parent-Instance pattern** - Recurring chores store rules on parent; instances generated on-demand (see architectural_patterns.md:15-38)
- **Client-side only** - No server dependencies, instant deployment via static hosting
- **Type-first development** - Comprehensive TypeScript interfaces prevent runtime errors
- **Custom hooks for data** - Encapsulates CRUD operations and side effects (see architectural_patterns.md:1-13)

## File References

### Entry Points
- `index.html:1` - HTML entry point with root div
- `src/main.tsx:1` - React app initialization
- `src/App.tsx:1` - Main component orchestrating all state and UI

### Configuration
- `package.json:1` - Dependencies and scripts
- `tsconfig.app.json:1` - TypeScript config with strict mode
- `vite.config.ts:1` - Vite build configuration
- `eslint.config.js:1` - ESLint rules

### Core Logic
- `src/hooks/useChores.ts:23` - `addChore` function
- `src/hooks/useChores.ts:72` - `updateChore` function
- `src/hooks/useChores.ts:89` - `toggleChoreComplete` function
- `src/utils/recurrence.ts:11` - `generateRecurringInstances` function
- `src/utils/recurrence.ts:82` - `shouldGenerateInstance` helper

## TypeScript Configuration

Strict mode enabled with:
- `strict: true` - Null safety, strict function types
- `noUnusedLocals: true` - Detect unused variables
- `noUnusedParameters: true` - Detect unused function parameters
- Target: ES2022, JSX: react-jsx (new transform)

## Known Limitations

- No backend - data lost if localStorage cleared
- No authentication/authorization
- No offline service worker
- No automated tests
- Weekly recurrence only (no daily/monthly/yearly)
- Single user per browser (no multi-user support)

## Additional Documentation

When working on specific aspects of this codebase, consult:

- **.claude/docs/architectural_patterns.md** - Design patterns, conventions, and architectural decisions used throughout the codebase (custom hooks pattern, parent-instance model, state management approach, component architecture)

**IMPORTANT**: When you work on a new feature or bug, create a git branch first.
Then work on changes in that branch for the remainder of the session.

---

**Last Updated:** 2026-01-03
**Codebase Status:** Production-ready, single commit (c9b0a95)
