// src/utils/storage.ts
import type { Chore, TeamMember } from '../types';

export const STORAGE_KEYS = {
  CHORES: 'chore-app-chores',
  TEAM_MEMBERS: 'chore-app-team-members'
} as const;

export function saveChores(chores: Chore[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHORES, JSON.stringify(chores));
  } catch (error) {
    console.error('Error saving chores to localStorage:', error);
    throw new Error('Failed to save chores');
  }
}

export function loadChores(): Chore[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHORES);
    if (!data) return [];
    return JSON.parse(data) as Chore[];
  } catch (error) {
    console.error('Error loading chores from localStorage:', error);
    return [];
  }
}

export function saveTeamMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
  } catch (error) {
    console.error('Error saving team members to localStorage:', error);
    throw new Error('Failed to save team members');
  }
}

export function loadTeamMembers(): TeamMember[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
    if (!data) return [];
    return JSON.parse(data) as TeamMember[];
  } catch (error) {
    console.error('Error loading team members from localStorage:', error);
    return [];
  }
}
