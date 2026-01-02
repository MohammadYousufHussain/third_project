// src/App.tsx
import { useState, useMemo } from 'react';
import { CalendarView } from './components/Calendar/CalendarView';
import { ChoreForm } from './components/ChoreForm/ChoreForm';
import { TeamList } from './components/TeamManagement/TeamList';
import { ChoreModal } from './components/ChoreDetails/ChoreModal';
import { useChores } from './hooks/useChores';
import { useTeamMembers } from './hooks/useTeamMembers';
import { getAllChoresForCalendar } from './utils/recurrence';
import { generateId, toISODate } from './utils/dateHelpers';
import type { Chore } from './types';
import { startOfMonth, endOfMonth } from 'date-fns';
import './App.css';

function App() {
  const { chores, addChore, updateChore, deleteChore, toggleChoreComplete } = useChores();
  const { teamMembers, addTeamMember, deleteTeamMember } = useTeamMembers();

  const [showChoreForm, setShowChoreForm] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [editingChore, setEditingChore] = useState<Chore | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get current month's chores for calendar
  const calendarChores = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return getAllChoresForCalendar(chores, { start, end });
  }, [chores]);

  const handleAddChore = () => {
    setEditingChore(undefined);
    setSelectedDate(null);
    setShowChoreForm(true);
  };

  const handleAddChoreForDate = (date: Date) => {
    setEditingChore(undefined);
    setSelectedDate(date);
    setShowChoreForm(true);
  };

  const handleSaveChore = (chore: Chore) => {
    if (editingChore) {
      updateChore(editingChore.id, chore);
    } else {
      addChore(chore);
    }
    setShowChoreForm(false);
    setEditingChore(undefined);
    setSelectedDate(null);
  };

  const handleSelectChore = (chore: Chore) => {
    setSelectedChore(chore);
  };

  const handleEditChore = () => {
    if (selectedChore) {
      // If it's a recurring instance, edit the parent chore
      if (selectedChore.parentId) {
        const parentChore = chores.find((c) => c.id === selectedChore.parentId);
        if (parentChore) {
          setEditingChore(parentChore);
        }
      } else {
        setEditingChore(selectedChore);
      }
      setSelectedChore(null);
      setShowChoreForm(true);
    }
  };

  const handleDeleteChore = () => {
    if (selectedChore) {
      // If it's a recurring instance, delete the parent chore
      if (selectedChore.parentId) {
        deleteChore(selectedChore.parentId);
      } else {
        deleteChore(selectedChore.id);
      }
      setSelectedChore(null);
    }
  };

  const handleToggleComplete = () => {
    if (selectedChore) {
      // If it's a recurring instance, we need to handle completions differently
      if (selectedChore.parentId) {
        const parentChore = chores.find((c) => c.id === selectedChore.parentId);
        if (parentChore) {
          const completions = parentChore.completions || [];
          const existingCompletion = completions.find(
            (c) => c.date === selectedChore.dueDate
          );

          if (existingCompletion) {
            // Remove completion
            const newCompletions = completions.filter(
              (c) => c.date !== selectedChore.dueDate
            );
            updateChore(parentChore.id, { completions: newCompletions });
          } else {
            // Add completion
            const newCompletion = {
              date: selectedChore.dueDate,
              completedAt: new Date().toISOString(),
            };
            updateChore(parentChore.id, {
              completions: [...completions, newCompletion],
            });
          }
        }
      } else {
        toggleChoreComplete(selectedChore.id);
      }
      setSelectedChore(null);
    }
  };

  const handleAddTeamMember = (name: string) => {
    try {
      const newMember = {
        id: generateId(),
        name,
        createdAt: new Date().toISOString(),
      };
      addTeamMember(newMember);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Office Chore Manager</h1>
        <div className="header-buttons">
          <button onClick={handleAddChore} className="btn btn-primary">
            + Add Chore
          </button>
          <button onClick={() => setShowTeamManagement(true)} className="btn btn-secondary">
            Manage Team
          </button>
        </div>
      </header>

      <main className="app-main">
        <CalendarView
          chores={calendarChores}
          onSelectChore={handleSelectChore}
          onSelectSlot={handleAddChoreForDate}
        />
      </main>

      {showChoreForm && (
        <ChoreForm
          chore={
            editingChore ||
            (selectedDate
              ? {
                  id: '',
                  title: '',
                  assignedTo: [],
                  dueDate: toISODate(selectedDate),
                  isCompleted: false,
                  isRecurring: false,
                  createdAt: '',
                  updatedAt: '',
                }
              : undefined)
          }
          teamMembers={teamMembers}
          onSave={handleSaveChore}
          onCancel={() => {
            setShowChoreForm(false);
            setEditingChore(undefined);
            setSelectedDate(null);
          }}
        />
      )}

      {showTeamManagement && (
        <TeamList
          members={teamMembers}
          onDelete={deleteTeamMember}
          onAdd={handleAddTeamMember}
          onClose={() => setShowTeamManagement(false)}
        />
      )}

      {selectedChore && (
        <ChoreModal
          chore={selectedChore}
          onClose={() => setSelectedChore(null)}
          onEdit={handleEditChore}
          onDelete={handleDeleteChore}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  );
}

export default App;
