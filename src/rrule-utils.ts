import { RRule, rrulestr } from "rrule";
import { formatWithTimezone } from "./timezone";

export function expandRecurringEvents<
  T extends { id: string; start: Date; end: Date; rrule?: string | null; exdates?: string[] | null }
>(events: T[], rangeStart: Date, rangeEnd: Date, timezone: string = "UTC"): T[] {
  const expandedEvents: T[] = [];
  const rStart = new Date(formatWithTimezone(rangeStart, timezone, "yyyy-MM-dd") + "T00:00:00Z");
  const rEnd = new Date(formatWithTimezone(rangeEnd, timezone, "yyyy-MM-dd") + "T23:59:59Z");

  for (const event of events) {
    if (!event.rrule) {
      expandedEvents.push(event);
      continue;
    }

    try {
      const rule = rrulestr(event.rrule);
      const eventWallStart = new Date(formatWithTimezone(event.start, timezone, "yyyy-MM-dd'T'HH:mm:ss") + "Z");
      const updatedRule = new RRule({
        ...rule.origOptions,
        dtstart: eventWallStart,
      });

      const instances = updatedRule.between(rStart, rEnd, true);
      const exdates = new Set(event.exdates || []);

      for (const instance of instances) {
        const instanceDateStr = instance.toISOString().split("T")[0];
        if (exdates.has(instanceDateStr)) continue;

        // Clone event and adjust dates
        const diff = instance.getTime() - eventWallStart.getTime();
        expandedEvents.push({
          ...event,
          id: `${event.id}_${instanceDateStr}`,
          start: new Date(event.start.getTime() + diff),
          end: new Date(event.end.getTime() + diff),
        });
      }
    } catch (e) {
      // Invalid rrule fallback
      expandedEvents.push(event);
    }
  }

  return expandedEvents;
}
