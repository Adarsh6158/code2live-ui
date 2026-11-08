export interface SprintConfig {
  kickoffDate: string | Date;
  sprintDurationDays?: number;
  initialSprintNumber?: number;
}

export type SprintStatus = "Current" | "Upcoming" | "Completed";

export interface SprintInfo {
  sprintNumber: number;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  formattedDateRange: string;
}

export const DEFAULT_SPRINT_CONFIG: SprintConfig = {
  kickoffDate: "2025-04-09",
  sprintDurationDays: 14,
  initialSprintNumber: 1,
};

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseLocalDate(input: Date | string): Date {
  if (input instanceof Date) {
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }
  if (typeof input === "string") {
    const parts = input.split("T")[0].split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toCalendarUtcMidnight(d: Date): number {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

export function formatSprintDateRange(startDate: Date, endDate: Date): string {
  const startMonth = SHORT_MONTHS[startDate.getMonth()];
  const startDay = startDate.getDate();
  const endMonth = SHORT_MONTHS[endDate.getMonth()];
  const endDay = endDate.getDate();

  if (startMonth === endMonth && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startMonth} ${startDay} – ${endDay}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

export function getSprintForDate(
  currentDate?: Date | string,
  configuration?: Partial<SprintConfig>,
  referenceDate?: Date | string
): SprintInfo {
  const kickoff = parseLocalDate(configuration?.kickoffDate ?? DEFAULT_SPRINT_CONFIG.kickoffDate);
  const sprintDurationDays = configuration?.sprintDurationDays ?? 14;
  const initialSprintNumber = configuration?.initialSprintNumber ?? 1;

  const target = currentDate ? parseLocalDate(currentDate) : parseLocalDate(new Date());
  const reference = referenceDate !== undefined
    ? parseLocalDate(referenceDate)
    : (currentDate ? target : parseLocalDate(new Date()));

  const msPerDay = 86400000;
  const targetUtc = toCalendarUtcMidnight(target);
  const kickoffUtc = toCalendarUtcMidnight(kickoff);
  const referenceUtc = toCalendarUtcMidnight(reference);

  const daysSinceKickoff = Math.floor((targetUtc - kickoffUtc) / msPerDay);

  if (daysSinceKickoff < 0) {
    const startDate = new Date(kickoff.getFullYear(), kickoff.getMonth(), kickoff.getDate());
    const endDate = new Date(
      kickoff.getFullYear(),
      kickoff.getMonth(),
      kickoff.getDate() + sprintDurationDays - 1
    );
    const startUtc = toCalendarUtcMidnight(startDate);
    const endUtc = toCalendarUtcMidnight(endDate);

    let status: SprintStatus = "Upcoming";
    if (referenceUtc >= startUtc && referenceUtc <= endUtc) {
      status = "Current";
    } else if (referenceUtc > endUtc) {
      status = "Completed";
    }

    return {
      sprintNumber: initialSprintNumber,
      startDate,
      endDate,
      status,
      formattedDateRange: formatSprintDateRange(startDate, endDate),
    };
  }

  const sprintIndex = Math.floor(daysSinceKickoff / sprintDurationDays);
  const sprintNumber = sprintIndex + initialSprintNumber;

  const startDate = new Date(
    kickoff.getFullYear(),
    kickoff.getMonth(),
    kickoff.getDate() + sprintIndex * sprintDurationDays
  );
  const endDate = new Date(
    kickoff.getFullYear(),
    kickoff.getMonth(),
    kickoff.getDate() + sprintIndex * sprintDurationDays + sprintDurationDays - 1
  );

  const startUtc = toCalendarUtcMidnight(startDate);
  const endUtc = toCalendarUtcMidnight(endDate);

  let status: SprintStatus = "Current";
  if (referenceUtc < startUtc) {
    status = "Upcoming";
  } else if (referenceUtc > endUtc) {
    status = "Completed";
  }

  return {
    sprintNumber,
    startDate,
    endDate,
    status,
    formattedDateRange: formatSprintDateRange(startDate, endDate),
  };
}
