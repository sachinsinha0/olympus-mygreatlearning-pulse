export type TicketStatus = "open" | "closed" | "reopened";
export type StatusFilter = "all" | TicketStatus;

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  closed: "Closed",
  reopened: "Reopened",
};

/** Filter pill order — "all" first. */
export const STATUS_FILTERS: StatusFilter[] = ["all", "open", "closed", "reopened"];

/** Return tickets matching the filter; "all" returns everything. */
export function filterByStatus<T extends { status: TicketStatus }>(
  tickets: T[],
  filter: StatusFilter,
): T[] {
  return filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
}

/** Count tickets per status, plus an "all" total. */
export function statusCounts(
  tickets: { status: TicketStatus }[],
): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = { all: tickets.length, open: 0, closed: 0, reopened: 0 };
  for (const t of tickets) counts[t.status]++;
  return counts;
}
