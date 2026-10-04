# 📅 Recurrence Calendar Lib

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)]()

> A robust, timezone-resilient recurrence expansion engine and 1D interval layout packing matrix for rendering calendar schedules without visual collisions or timezone drift.

---

## 🎯 Executive Summary & Problem Space

Building calendar systems involves two notorious engineering challenges:
1. **Timezone Drift & Daylight Saving Time (DST)**: Standard JavaScript Date instances shift unexpectedly across daylight saving boundaries. When recurring events (RRULEs) are expanded on devices in different timezones, occurrences frequently drift into the previous or next day.
2. **Interval Collision & Visual Packing**: Rendering overlapping events in a daily or weekly column view requires non-overlapping horizontal partitioning. Without a layout algorithm, overlapping events render stacked directly on top of each other, obscuring text and click targets.

**Recurrence Calendar Lib** solves both problems cleanly: it guarantees wall-clock stability across arbitrary IANA timezone boundaries and implements a greedy interval-coloring algorithm to calculate precise CSS left and width coordinates in (n \log n)$ time.

---

## ⚡ Core Technical Features

- **Standard RFC 5545 RRULE Support**: Expands recurrence rules (FREQ=DAILY, WEEKLY, MONTHLY, BYDAY, INTERVAL) inside a bounded window.
- **EXDATE (Exception Date) Compliance**: Handles single-instance cancellations and exclusions within repeating series.
- **Timezone Anchor (Wall-Clock Invariant)**: Converts dates into normalized wall-clock representations before feeding to recurrence iterators, eliminating local device offset contamination.
- **1D Interval Packing Matrix**: Computes horizontal column indices and width splits for arbitrarily overlapping events (analogous to the algorithms used by Google Calendar and Outlook).

---

## 📐 The 1D Layout Packing Algorithm Explained

To layout overlapping events in a Day/Week timeline grid:
1. **Sort**: Timed events are sorted ascending by start timestamp, with ties broken by descending end timestamp ((n \log n)$).
2. **Column Assignment**: We iterate through each event and greedily find the first column where the last event's end time is less than or equal to the current event's start time. If no such column exists, a new column is appended ((n \cdot k)$ where  \ll n$).
3. **Collision Cluster Resolution**: For every event, we identify all distinct columns that contain at least one overlapping event within its time window.
4. **CSS Metric Calculation**:
   \text{Width} = \frac{100\%}{\text{Total Overlapping Columns}}, \quad \text{Left} = \text{Rank} \times \text{Width}

`mermaid
sequenceDiagram
    autonumber
    participant App as Calendar Grid
    participant Engine as Layout Engine
    participant Sorter as Interval Sorter
    participant Matrix as Column Allocator

    App->>Engine: computeEventLayouts(events)
    Engine->>Sorter: Sort events by start asc, duration desc
    Sorter-->>Engine: Sorted array
    loop For each event
        Engine->>Matrix: Find first non-overlapping column
        alt Free column exists
            Matrix-->>Engine: Place in column[i]
        else All columns full
            Matrix-->>Engine: Create new column[i+1]
        end
    end
    Engine->>Engine: Compute CSS left% and width% per cluster
    Engine-->>App: Return record map: { id: { left, width } }
`

---

## 🚀 Installation & Quick Start

`ash
git clone https://github.com/sahejvirsingh/recurrence-calendar-lib.git
cd recurrence-calendar-lib
npm install
npm test
npm run demo
`

### Usage Example

`	ypescript
import { 
  expandRecurringEvents, 
  computeEventLayouts, 
  CalendarEvent 
} from "recurrence-calendar-lib";

// 1. Expand recurring series safely within a target month
const recurringEvent = {
  id: "standup",
  title: "Engineering Daily Standup",
  start: new Date("2024-03-01T09:00:00Z"),
  end: new Date("2024-03-01T09:30:00Z"),
  rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
  exdates: ["2024-03-08"] // Public holiday exception
};

const expandedOccurrences = expandRecurringEvents(
  [recurringEvent],
  new Date("2024-03-01T00:00:00Z"),
  new Date("2024-03-31T23:59:59Z"),
  "America/New_York"
);

// 2. Compute visual CSS coordinates for overlapping events
const eventsOnGrid: CalendarEvent[] = [
  { id: "e1", title: "Keynote", start: new Date("2024-03-01T10:00:00Z"), end: new Date("2024-03-01T11:30:00Z"), isAllDay: false },
  { id: "e2", title: "Workshop", start: new Date("2024-03-01T10:30:00Z"), end: new Date("2024-03-01T12:00:00Z"), isAllDay: false },
  { id: "e3", title: "Q&A Session", start: new Date("2024-03-01T11:00:00Z"), end: new Date("2024-03-01T12:30:00Z"), isAllDay: false },
];

const layoutMatrix = computeEventLayouts(eventsOnGrid);
console.log(layoutMatrix);
// Outputs computed visual styles:
// {
//   e1: { left: '0%', width: '33.33%' },
//   e2: { left: '33.33%', width: '33.33%' },
//   e3: { left: '66.66%', width: '33.33%' }
// }
`

---

## 🧪 Vitest Test Suite

- **Collision Isolation**: Verifies non-overlapping events retain left: 0%, width: 100%.
- **Complex Clusters**: Verifies 2-way and 3-way overlaps split widths symmetrically.
- **Exclusion Filters**: Confirms dates listed in exdates are omitted from recurrence output.
- **Series Identification**: Verifies expanded occurrences receive deterministic unique compound keys ({id}_{YYYY-MM-DD}).

---

## 📄 License
MIT © [Sahejvir Singh](https://github.com/sahejvirsingh)
