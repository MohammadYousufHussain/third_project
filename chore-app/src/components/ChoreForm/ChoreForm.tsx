// src/components/ChoreForm/ChoreForm.tsx
import { useState, useEffect } from 'react';
import type { Chore, TeamMember, RecurrencePattern } from '../../types';
import { RecurrenceSelector } from './RecurrenceSelector';
import { generateId, toISODate } from '../../utils/dateHelpers';

interface ChoreFormProps {
  chore?: Chore;
  teamMembers: TeamMember[];
  onSave: (chore: Chore) => void;
  onCancel: () => void;
}

export function ChoreForm({ chore, teamMembers, onSave, onCancel }: ChoreFormProps) {
  const [title, setTitle] = useState(chore?.title || '');
  const [description, setDescription] = useState(chore?.description || '');
  const [dueDate, setDueDate] = useState(chore?.dueDate || toISODate(new Date()));
  const [assignedTo, setAssignedTo] = useState<string[]>(chore?.assignedTo || []);
  const [isRecurring, setIsRecurring] = useState(chore?.isRecurring || false);
  const [recurrence, setRecurrence] = useState<RecurrencePattern>(
    chore?.recurrence || {
      pattern: 'weekly',
      daysOfWeek: [],
      startDate: toISODate(new Date()),
      endDate: null,
    }
  );

  useEffect(() => {
    if (isRecurring && recurrence.startDate === '') {
      setRecurrence((prev) => ({
        ...prev,
        startDate: dueDate,
      }));
    }
  }, [isRecurring, dueDate, recurrence.startDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a chore title');
      return;
    }

    if (!dueDate) {
      alert('Please select a due date');
      return;
    }

    if (isRecurring && recurrence.daysOfWeek.length === 0) {
      alert('Please select at least one day for recurring chores');
      return;
    }

    const now = new Date().toISOString();

    const newChore: Chore = {
      id: chore?.id || generateId(),
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      dueDate,
      isCompleted: chore?.isCompleted || false,
      isRecurring,
      recurrence: isRecurring ? recurrence : undefined,
      parentId: chore?.parentId,
      completions: chore?.completions || [],
      createdAt: chore?.createdAt || now,
      updatedAt: now,
    };

    onSave(newChore);
  };

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setAssignedTo(selected);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{chore ? 'Edit Chore' : 'Add New Chore'}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              disabled={isRecurring}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Assigned To
            </label>
            <select
              multiple
              value={assignedTo}
              onChange={handleAssignedToChange}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '100%',
                minHeight: '100px',
              }}
            >
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
            <small style={{ color: '#666' }}>Hold Ctrl/Cmd to select multiple</small>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontWeight: 'bold' }}>Make this a recurring chore</span>
            </label>
          </div>

          {isRecurring && (
            <RecurrenceSelector value={recurrence} onChange={setRecurrence} />
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3174ad',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {chore ? 'Update' : 'Create'} Chore
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
