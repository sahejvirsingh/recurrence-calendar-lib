import type { CalendarEvent } from "./types";

export function computeEventLayouts(events: CalendarEvent[]): Record<string, { left: string; width: string }> {
  const timedEvents = events
    .filter((e) => !e.isAllDay)
    .sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime());

  const columns: CalendarEvent[][] = [];

  timedEvents.forEach((event) => {
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const lastEvent = col[col.length - 1];
      if (lastEvent && lastEvent.end.getTime() <= event.start.getTime()) {
        col.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
  });

  const layouts: Record<string, { left: string; width: string }> = {};

  timedEvents.forEach((event) => {
    const overlappingColumns = columns.filter((col) =>
      col.some((e) => e.start < event.end && e.end > event.start)
    );

    const numColumns = overlappingColumns.length || 1;
    const rank = overlappingColumns.findIndex((col) => col.includes(event));
    const width = 100 / numColumns;
    const left = rank * width;

    layouts[event.id] = {
      left: `${left}%`,
      width: `${width}%`,
    };
  });

  return layouts;
}
