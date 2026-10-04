export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  rrule?: string | null;
  exdates?: string[] | null;
}

export interface RecurrenceSchedule {
  date: string; // YYYY-MM-DD
  index: number;
}
