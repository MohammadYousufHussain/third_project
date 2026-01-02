// src/components/ChoreForm/RecurrenceSelector.tsx
import type { RecurrencePattern } from '../../types';
import { DAY_NAMES } from '../../utils/dateHelpers';

interface RecurrenceSelectorProps {
  value: RecurrencePattern;
  onChange: (pattern: RecurrencePattern) => void;
}

export function RecurrenceSelector({ value, onChange }: RecurrenceSelectorProps) {
  const handleDayToggle = (dayIndex: number) => {
    const newDaysOfWeek = value.daysOfWeek.includes(dayIndex)
      ? value.daysOfWeek.filter((d) => d !== dayIndex)
      : [...value.daysOfWeek, dayIndex].sort((a, b) => a - b);

    onChange({
      ...value,
      daysOfWeek: newDaysOfWeek,
    });
  };

  const handleStartDateChange = (date: string) => {
    onChange({
      ...value,
      startDate: date,
    });
  };

  const handleEndDateChange = (date: string) => {
    onChange({
      ...value,
      endDate: date || null,
    });
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h4 style={{ marginTop: 0 }}>Recurrence Pattern</h4>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          Repeat on:
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {DAY_NAMES.map((day, index) => (
            <label
              key={index}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: value.daysOfWeek.includes(index) ? '#3174ad' : 'white',
                color: value.daysOfWeek.includes(index) ? 'white' : 'black',
              }}
            >
              <input
                type="checkbox"
                checked={value.daysOfWeek.includes(index)}
                onChange={() => handleDayToggle(index)}
                style={{ marginRight: '0.25rem' }}
              />
              {day}
            </label>
          ))}
        </div>
        {value.daysOfWeek.length === 0 && (
          <small style={{ color: 'red', display: 'block', marginTop: '0.5rem' }}>
            Please select at least one day
          </small>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          Start Date:
        </label>
        <input
          type="date"
          value={value.startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
        />
      </div>

      <div>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
          End Date (optional):
        </label>
        <input
          type="date"
          value={value.endDate || ''}
          onChange={(e) => handleEndDateChange(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
        />
      </div>
    </div>
  );
}
