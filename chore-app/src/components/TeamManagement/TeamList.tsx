// src/components/TeamManagement/TeamList.tsx
import type { TeamMember } from '../../types';
import { AddTeamMember } from './AddTeamMember';

interface TeamListProps {
  members: TeamMember[];
  onDelete: (id: string) => void;
  onAdd: (name: string) => void;
  onClose: () => void;
}

export function TeamList({ members, onDelete, onAdd, onClose }: TeamListProps) {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      onDelete(id);
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
      >
        <h2 style={{ marginTop: 0 }}>Team Management</h2>

        <AddTeamMember onAdd={onAdd} />

        {members.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No team members yet. Add one above!
          </p>
        ) : (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Team Members ({members.length})</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {members.map((member) => (
                <li
                  key={member.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    border: '1px solid #dee2e6',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{member.name}</span>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
