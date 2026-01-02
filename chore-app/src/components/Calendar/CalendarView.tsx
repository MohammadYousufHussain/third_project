// src/components/Calendar/CalendarView.tsx
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Chore, CalendarEvent } from '../../types';
import { parseISO } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.module.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  chores: Chore[];
  onSelectChore: (chore: Chore) => void;
  onSelectSlot: (date: Date) => void;
}

export function CalendarView({ chores, onSelectChore, onSelectSlot }: CalendarViewProps) {
  // Convert chores to calendar events
  const events: CalendarEvent[] = chores.map((chore) => ({
    id: chore.id,
    title: chore.title,
    start: parseISO(chore.dueDate),
    end: parseISO(chore.dueDate),
    resource: chore,
  }));

  const handleSelectEvent = (event: CalendarEvent) => {
    onSelectChore(event.resource);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    onSelectSlot(slotInfo.start);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const chore = event.resource;
    let backgroundColor = '#3174ad'; // Default blue

    if (chore.isCompleted) {
      backgroundColor = '#4caf50'; // Green for completed
    } else if (chore.assignedTo && chore.assignedTo.length > 0) {
      backgroundColor = '#ff9800'; // Orange for assigned
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div style={{ height: '600px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
      />
    </div>
  );
}
