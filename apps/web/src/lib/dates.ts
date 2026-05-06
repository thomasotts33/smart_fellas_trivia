export function formatGameDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric", year: "numeric" },
) {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(undefined, { ...options, timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}
