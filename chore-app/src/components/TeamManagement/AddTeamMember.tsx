// src/components/TeamManagement/AddTeamMember.tsx
import { useState } from 'react';

interface AddTeamMemberProps {
  onAdd: (name: string) => void;
}

export function AddTeamMember({ onAdd }: AddTeamMemberProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter team member name"
        style={{
          flex: 1,
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3174ad',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Add
      </button>
    </form>
  );
}
