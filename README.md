# 📅 Recurrence Calendar Lib

A timezone-correct calendar engine designed for parsing complex repeating events (RRULEs) and computing CSS layout matrices for overlapping grid events.

## ✨ Features

- **RRULE Expansion**: Safely calculates recurring event instances within a date boundary using rule.
- **Bulletproof Timezones**: Wraps date-fns-tz to ensure events anchor to wall-clock time regardless of the host machine's local timezone.
- **1D Grid Layout Algorithm**: Automatically computes width and left CSS percentages for overlapping events (like Google Calendar's day view).
- **EXDATE Support**: Properly respects exclusion dates for modified recurring events.

## 🚀 Quick Start

`ash
npm install
npm test
npm run demo
`

## 📄 License
MIT
