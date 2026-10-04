import { describe, it, expect } from "vitest";
import { computeEventLayouts } from "../src/engine";
import type { CalendarEvent } from "../src/types";

describe("Calendar Engine Layout", () => {
  it("should lay out non-overlapping events in full width", () => {
    const events: CalendarEvent[] = [
      { id: "1", title: "A", start: new Date("2024-01-01T10:00:00Z"), end: new Date("2024-01-01T11:00:00Z"), isAllDay: false },
      { id: "2", title: "B", start: new Date("2024-01-01T12:00:00Z"), end: new Date("2024-01-01T13:00:00Z"), isAllDay: false }
    ];
    const layouts = computeEventLayouts(events);
    expect(layouts["1"]).toEqual({ left: "0%", width: "100%" });
    expect(layouts["2"]).toEqual({ left: "0%", width: "100%" });
  });

  it("should split width for overlapping events", () => {
    const events: CalendarEvent[] = [
      { id: "1", title: "A", start: new Date("2024-01-01T10:00:00Z"), end: new Date("2024-01-01T12:00:00Z"), isAllDay: false },
      { id: "2", title: "B", start: new Date("2024-01-01T11:00:00Z"), end: new Date("2024-01-01T13:00:00Z"), isAllDay: false }
    ];
    const layouts = computeEventLayouts(events);
    expect(layouts["1"].width).toBe("50%");
    expect(layouts["2"].width).toBe("50%");
    expect(layouts["1"].left).toBe("0%");
    expect(layouts["2"].left).toBe("50%");
  });
});
