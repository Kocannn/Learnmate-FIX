import {
  format,
  addDays,
} from "date-fns";
import { id } from "date-fns/locale";

// Format date: "Senin, 15 Januari 2024"
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "EEEE, dd MMMM yyyy", { locale: id });
}

// Format time: "09:30"
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "HH:mm", { locale: id });
}

// Get available dates (next 7 days)
export function getAvailableDates() {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const date = addDays(today, i);
    dates.push({
      value: format(date, "yyyy-MM-dd"),
      label: format(date, "EEEE, dd MMMM yyyy", { locale: id }),
    });
  }

  return dates;
}
