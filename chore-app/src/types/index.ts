// src/types/index.ts

export interface RecurrencePattern {
  pattern: 'weekly';           // Fixed for MVP
  daysOfWeek: number[];        // 0-6 (Sun-Sat), e.g., [1,3] for Mon/Wed
  startDate: string;           // ISO date string
  endDate: string | null;      // Optional end date
}

export interface ChoreCompletion {
  date: string;                // ISO date string
  completedBy?: string;        // Team member name
  completedAt: string;         // ISO timestamp
}

export interface Chore {
  id: string;                  // UUID
  title: string;               // Chore name
  description?: string;        // Optional details
  assignedTo: string[];        // Team member names
  dueDate: string;             // ISO date string (YYYY-MM-DD)
  isCompleted: boolean;
  isRecurring: boolean;
  recurrence?: RecurrencePattern; // Only if isRecurring = true
  parentId?: string;           // If this is a recurring instance
  completions?: ChoreCompletion[]; // Track recurring chore completions
  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp
}

export interface TeamMember {
  id: string;                  // UUID
  name: string;                // Team member name
  createdAt: string;           // ISO timestamp
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Chore;             // Full chore object for event handlers
}
