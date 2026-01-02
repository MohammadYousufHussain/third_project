// src/hooks/useTeamMembers.ts
import { useLocalStorage } from './useLocalStorage';
import type { TeamMember } from '../types';
import { saveTeamMembers, loadTeamMembers } from '../utils/storage';

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>(
    'teamMembers',
    [],
    saveTeamMembers,
    loadTeamMembers
  );

  const addTeamMember = (member: TeamMember) => {
    // Check for duplicates
    const exists = teamMembers.some(
      (m) => m.name.toLowerCase() === member.name.toLowerCase()
    );
    if (exists) {
      throw new Error('Team member with this name already exists');
    }
    setTeamMembers((prev) => [...prev, member]);
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const getTeamMemberById = (id: string): TeamMember | undefined => {
    return teamMembers.find((member) => member.id === id);
  };

  return {
    teamMembers,
    addTeamMember,
    deleteTeamMember,
    getTeamMemberById
  };
}
