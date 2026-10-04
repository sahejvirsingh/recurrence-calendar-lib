import { expandRecurringEvents, computeEventLayouts } from "../src";

console.log("--- RRULE Expansion ---");
const evt = {
  id: "gym",
  start: new Date("2024-03-01T17:00:00Z"),
  end: new Date("2024-03-01T18:00:00Z"),
  rrule: "FREQ=WEEKLY;BYDAY=MO,WE,FR"
};
const expanded = expandRecurringEvents([evt], new Date("2024-03-01T00:00:00Z"), new Date("2024-03-10T00:00:00Z"));
console.log(`Found ${expanded.length} instances between Mar 1 and Mar 10:`);
expanded.forEach(e => console.log(` - ${e.start.toISOString()}`));

console.log("\n--- Calendar Layout ---");
const layouts = computeEventLayouts(expanded.map(e => ({ ...e, title: "Gym", isAllDay: false })));
console.log("Layout constraints (overlapping events get packed into columns):");
console.log(layouts);

