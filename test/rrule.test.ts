import { describe, it, expect } from "vitest";
import { expandRecurringEvents } from "../src/rrule-utils";

describe("RRULE Expansion", () => {
  it("should expand weekly events", () => {
    const event = {
      id: "evt_1",
      start: new Date("2024-01-01T10:00:00Z"),
      end: new Date("2024-01-01T11:00:00Z"),
      rrule: "FREQ=WEEKLY;INTERVAL=1"
    };

    const expanded = expandRecurringEvents([event], new Date("2024-01-01T00:00:00Z"), new Date("2024-01-15T00:00:00Z"));
    
    // Jan 1, Jan 8, Jan 15 = 3 instances
    expect(expanded.length).toBe(3);
    expect(expanded[0].id).toBe("evt_1_2024-01-01");
    expect(expanded[1].id).toBe("evt_1_2024-01-08");
    expect(expanded[2].id).toBe("evt_1_2024-01-15");
  });

  it("should exclude EXDATES", () => {
    const event = {
      id: "evt_1",
      start: new Date("2024-01-01T10:00:00Z"),
      end: new Date("2024-01-01T11:00:00Z"),
      rrule: "FREQ=WEEKLY;INTERVAL=1",
      exdates: ["2024-01-08"]
    };

    const expanded = expandRecurringEvents([event], new Date("2024-01-01T00:00:00Z"), new Date("2024-01-15T00:00:00Z"));
    
    // Jan 1, Jan 15 (Jan 8 excluded)
    expect(expanded.length).toBe(2);
    expect(expanded[0].id).toBe("evt_1_2024-01-01");
    expect(expanded[1].id).toBe("evt_1_2024-01-15");
  });
});
