# Architectural Patterns

This document describes recurring architectural patterns, design decisions, and conventions used throughout the Office Chore Manager codebase.

## Custom Hooks Pattern

**Pattern:** Encapsulate data operations and side effects in custom hooks.

**Implementation:**
- `src/hooks/useChores.ts:1` - Chore CRUD operations
- `src/hooks/useTeamMembers.ts:1` - Team member CRUD operations
- `src/hooks/useLocalStorage.ts:1` - Persistent state with callbacks

**Convention:**
- Hooks return state + operation functions (e.g., `[chores, { addChore, updateChore, deleteChore, toggleChoreComplete }]`)
- All side effects (localStorage saves) handled inside hooks
- Hooks expose clean, synchronous APIs to components
- No prop drilling - hooks can be called from any component

**Example:** `src/hooks/useChores.ts:23-45` shows `addChore` generating recurring instances and saving to localStorage atomically.

## Parent-Instance Pattern for Recurring Chores

**Pattern:** Parent chores store recurrence rules; child instances generated dynamically.

**Why:** Memory efficiency + flexibility. Storing every recurring instance would bloat localStorage. Dynamic generation allows editing recurrence rules retroactively.

**Implementation:**
- Parent chores have `recurrence: RecurrencePattern` (src/types/index.ts:16-21)
- Instances have `parentChoreId: string` linking back to parent
- Instance IDs formatted as `{parentId}-{YYYY-MM-DD}` (src/utils/dateHelpers.ts:13)
- Parent stores completions: `completions: ChoreCompletion[]` (src/types/index.ts:8)

**Generation Logic:**
- `src/utils/recurrence.ts:11` - `generateRecurringInstances` creates instances for date range
- `src/App.tsx:65-127` - Generates instances for current calendar view
- `src/utils/recurrence.ts:82` - `shouldGenerateInstance` checks day-of-week match + boundaries

**Completion Tracking:**
- Completions stored on parent, indexed by instance ID
- `src/hooks/useChores.ts:89` - `toggleChoreComplete` updates parent's completions array
- Instance-specific completion prevents marking all instances complete

**Editing Behavior:**
- Editing parent chore affects all future instances
- Past completions preserved via instance ID keys
- No edit propagation needed - instances regenerated on each render

## State Management: React Hooks + localStorage

**Pattern:** No Redux/Context API. State lifted to App.tsx; persistence via custom hooks.

**Why:** Application scope is small. Props passing acceptable. Avoids boilerplate of global state libraries.

**Implementation:**
- `src/App.tsx:18-19` - All state initialized with `useChores` and `useTeamMembers`
- State passed to child components via props
- Components call hook functions to mutate state
- `src/hooks/useLocalStorage.ts:6-49` - Generic persistent state hook with save callback

**Convention:**
- State updates trigger automatic localStorage saves
- Error handling for localStorage quota/access failures (src/utils/storage.ts:16-31)
- Save operations use try-catch with console warnings
- No optimistic UI - updates synchronous

## Modal-Based UI Architecture

**Pattern:** All interactions (forms, details, team management) use modal overlays.

**Why:** Keeps calendar as primary view. Avoids routing complexity. Better UX for quick edits.

**Implementation:**
- `src/components/ChoreForm/ChoreForm.tsx:1` - Create/edit chore modal
- `src/components/ChoreDetails/ChoreModal.tsx:1` - View chore details modal
- `src/components/TeamManagement/TeamList.tsx:1` - Team management modal
- `src/App.tsx:23-28` - Modal visibility state managed in App.tsx

**Convention:**
- Modals receive `onClose` callback prop
- Modals manage their own internal form state
- On submit, modal calls parent function (e.g., `addChore`) then closes
- Overlay click closes modal (common UX pattern)

**Styling:**
- Fixed positioning with z-index layering
- Semi-transparent backdrop (src/components/ChoreForm/ChoreForm.module.css:1-13)
- Centered content containers

## Type-First Development

**Pattern:** Define TypeScript interfaces before implementation.

**Implementation:**
- `src/types/index.ts:1` - Centralized type definitions
- Interfaces for all domain entities: `Chore`, `TeamMember`, `RecurrencePattern`, `ChoreCompletion`, `CalendarEvent`
- No `any` types - strict typing enforced (tsconfig.app.json:12)

**Convention:**
- Optional fields use `?` syntax (e.g., `description?: string`)
- Dates stored as ISO strings, never Date objects (avoids serialization issues)
- Arrays always typed (e.g., `assignedTo: string[]`)
- Enums avoided - string literals used for status indicators

**Benefits:**
- IntelliSense autocomplete in IDEs
- Compile-time error detection
- Self-documenting code - interfaces describe data shape
- Safe refactoring

## Component File Organization

**Pattern:** Feature-based directories with collocated styles.

**Structure:**
```
src/components/{Feature}/
  ├── {Feature}Component.tsx
  ├── {Feature}Component.module.css
  └── {SubComponent}.tsx (if needed)
```

**Example:**
- `src/components/ChoreForm/` contains ChoreForm.tsx, RecurrenceSelector.tsx, ChoreForm.module.css

**Convention:**
- One primary component per directory
- CSS Modules for scoped styles (`.module.css` suffix)
- Sub-components in same directory if tightly coupled
- No index.ts barrel exports (import directly from component file)

## Date Handling Conventions

**Pattern:** Use date-fns for all date operations; store dates as ISO strings.

**Implementation:**
- `src/utils/dateHelpers.ts:1` - Date formatting utilities
- All date storage uses `YYYY-MM-DD` ISO format
- `date-fns/format` and `date-fns/parse` for conversions

**Convention:**
- Input elements use `type="date"` (native browser picker)
- Display dates formatted with date-fns (e.g., `format(date, 'PPP')`)
- Day-of-week indexed 0-6 (Sunday=0) matching JavaScript Date.getDay()
- Recurrence boundaries checked with `isBefore`/`isAfter` (src/utils/recurrence.ts:82-108)

**Why:**
- ISO strings serialize/deserialize cleanly with JSON
- date-fns is tree-shakable (smaller bundle than moment.js)
- Native date inputs provide localized UX

## Error Handling Strategy

**Pattern:** Defensive localStorage access with graceful degradation.

**Implementation:**
- `src/utils/storage.ts:16-31` - Try-catch wrappers for localStorage operations
- Console warnings on errors (no user-facing alerts)
- Return defaults on load failure (empty arrays)

**Convention:**
- No error boundaries - errors caught at operation level
- Form validation via HTML5 attributes (`required`, `pattern`)
- No async error states (all operations synchronous)

**Limitations:**
- No user notification for localStorage quota exceeded
- No retry logic
- No fallback storage mechanism

## Visual Status Indicators

**Pattern:** Color-coded chore states for quick scanning.

**Implementation:**
- Blue: Unassigned chores (`assignedTo.length === 0`)
- Orange: Assigned chores (`assignedTo.length > 0 && !completed`)
- Green: Completed chores (`completed === true`)

**Applied in:**
- `src/App.tsx:103-105` - Color selection for calendar events
- `src/components/Calendar/CalendarView.tsx:1` - Event rendering

**Convention:**
- Colors defined inline (no theme system)
- Same colors used consistently across calendar and modals
- No accessibility considerations (color-only indicators)

## Recurrence Rule Storage

**Pattern:** Store recurrence as structured data, not cron expressions.

**Implementation:**
- `src/types/index.ts:16-21` - RecurrencePattern interface
```typescript
interface RecurrencePattern {
  frequency: 'weekly';
  daysOfWeek: number[]; // 0 (Sun) - 6 (Sat)
  startDate?: string;
  endDate?: string;
}
```

**Why:**
- Human-readable in localStorage
- Easy UI mapping (checkboxes for days)
- Simple validation logic
- Extensible to other frequencies later

**Alternative Rejected:**
- Cron expressions: Too complex for UI
- RRule library: Overkill for weekly-only recurrence

## Naming Conventions

**Components:** PascalCase, noun-based (e.g., `ChoreForm`, `TeamList`)

**Hooks:** camelCase with `use` prefix (e.g., `useChores`, `useLocalStorage`)

**Utilities:** camelCase, verb-based (e.g., `generateRecurringInstances`, `saveChores`)

**Types:** PascalCase (e.g., `Chore`, `RecurrencePattern`)

**CSS Classes:** kebab-case, scoped via CSS Modules (e.g., `.modal-backdrop`)

**Files:** Match primary export name (e.g., `ChoreForm.tsx` exports `ChoreForm`)

---

**Pattern Count:** 11 core patterns identified across codebase
**Last Updated:** 2026-01-03
