import { formatInTimeZone, toZonedTime, fromZonedTime } from "date-fns-tz";

export function resolveTimezone(timezone?: string | null): string {
  return timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getNowInTimezone(timezone: string): Date {
  return toZonedTime(new Date(), timezone);
}

export function toWallClock(date: Date, timezone: string): Date {
  const formatted = formatInTimeZone(date, timezone, "yyyy-MM-dd'T'HH:mm:ss'Z'");
  return new Date(formatted);
}

export function wallClockToUTC(dateStr: string, timezone: string): Date {
  return fromZonedTime(new Date(dateStr), timezone);
}

export function formatWithTimezone(date: Date, timezone: string, formatString: string = "yyyy-MM-dd"): string {
  return formatInTimeZone(date, timezone, formatString);
}
