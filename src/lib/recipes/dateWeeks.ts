const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type MenuDay = (typeof dayNames)[number];

export const menuDays = [...dayNames];

export function getWeekStart(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay();

  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);

  return copy;
}

export function formatWeekKey(date = new Date()) {
  return getWeekStart(date).toISOString().slice(0, 10);
}

export function addWeeks(date: Date, weeks: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + weeks * 7);
  return copy;
}

export function getWeekLabel(weekKey: string) {
  const start = new Date(`${weekKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} - ${end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function getEmptyWeekMenu() {
  return menuDays.reduce<Record<string, number[]>>(
    (acc, day) => {
      acc[day] = [];
      return acc;
    },
    {}
  );
}

export function getNextWeekKey(weekKey: string) {
  const date = new Date(`${weekKey}T00:00:00`);
  return formatWeekKey(addWeeks(date, 1));
}

export function getPreviousWeekKey(weekKey: string) {
  const date = new Date(`${weekKey}T00:00:00`);
  return formatWeekKey(addWeeks(date, -1));
}

export function capitalizeDay(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}