// src/components/ChoreDetails/ChoreModal.tsx
import type { Chore } from '../../types';
import { formatDate, getDayName } from '../../utils/dateHelpers';

interface ChoreModalProps {
  chore: Chore;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function ChoreModal({ chore, onClose, onEdit, onDelete, onToggleComplete }: ChoreModalProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      onDelete();
    }
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, flex: 1 }}>{chore.title}</h2>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              backgroundColor: chore.isCompleted ? '#4caf50' : '#ff9800',
              color: 'white',
            }}
          >
            {chore.isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          {chore.description && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Description:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>{chore.description}</p>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <strong>Due Date:</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              {formatDate(chore.dueDate)}
            </p>
          </div>

          {chore.assignedTo && chore.assignedTo.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Assigned To:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                {chore.assignedTo.join(', ')}
              </p>
            </div>
          )}

          {chore.isRecurring && chore.recurrence && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Recurrence:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                Repeats every{' '}
                {chore.recurrence.daysOfWeek.map((day) => getDayName(day)).join(', ')}
              </p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.875rem' }}>
                From {formatDate(chore.recurrence.startDate)}
                {chore.recurrence.endDate && ` to ${formatDate(chore.recurrence.endDate)}`}
              </p>
            </div>
          )}

          {chore.parentId && (
            <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
              <small style={{ color: '#1976d2' }}>
                This is an instance of a recurring chore
              </small>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={onToggleComplete}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: chore.isCompleted ? '#6c757d' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {chore.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </button>

          <button
            onClick={onEdit}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3174ad',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
