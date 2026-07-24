import detailJson from "../../mocks/pulseCourseDetail.json";
import issuesJson from "../../mocks/pulse-issues.json";
import type { CourseDetail, CourseItem, CourseSection, PulseIssue } from "./types";

const detail = detailJson as CourseDetail;
const issues = issuesJson as PulseIssue[];

export function getCourseDetail(): CourseDetail {
  return detail;
}

function isHandsOn(item: CourseItem): boolean {
  return item.type === "video" && /hands[-\s]?on/i.test(item.title);
}

/**
 * Move the hands-on item(s) to immediately after the first non-hands-on video,
 * preserving the relative order of everything else. Discovery fix: engaged users
 * spent their session on intro videos and quit before reaching the hands-on at
 * the end — surfacing it right after the first video gets them to the payoff fast.
 * No-op when there is no hands-on item or no non-hands-on video to anchor to.
 */
export function reorderHandsOnAfterFirstVideo(items: CourseItem[]): CourseItem[] {
  const handsOn = items.filter(isHandsOn);
  if (handsOn.length === 0) return items;
  const rest = items.filter((i) => !isHandsOn(i));
  const firstVideoIdx = rest.findIndex((i) => i.type === "video");
  if (firstVideoIdx < 0) return items;
  return [...rest.slice(0, firstVideoIdx + 1), ...handsOn, ...rest.slice(firstVideoIdx + 1)];
}

function sectionHasHandsOn(sections: CourseSection[]): boolean {
  return sections.some((s) => (s.items ?? []).some(isHandsOn));
}

export function getSectionsForModule(moduleId: string): CourseSection[] {
  const authored = detail.sections.filter((s) => s.moduleId === moduleId);
  // Use the authored curriculum only when it actually contains a hands-on item.
  // Otherwise synthesize a full curriculum from the issue's own fields: this keeps
  // "Resume Learning" alive for modules with no authored curriculum AND guarantees
  // that overview-only modules still expose a hands-on demo the card can link to.
  const base = authored.length > 0 && sectionHasHandsOn(authored)
    ? authored
    : synthesizeSectionsForModule(moduleId);
  return base.map((s) => ({ ...s, items: reorderHandsOnAfterFirstVideo(s.items ?? []) }));
}

function synthesizeSectionsForModule(moduleId: string): CourseSection[] {
  const issue = issues.find((i) => i.id === moduleId);
  if (!issue) return [];

  const tool = issue.toolName ?? issue.title;
  const topics = [
    { title: "The shift", description: `What changed with ${tool} and why it matters for how teams ship.` },
    { title: "The workflow", description: `A concrete way to apply ${tool} on real work, with guardrails.` },
    { title: "The trade-offs", description: "Where this approach earns its keep, and where it doesn't." },
  ];

  const overview: CourseItem = {
    id: `${moduleId}-intro`,
    type: "overview",
    title: "Overview",
    moduleLabel: `Module ${issue.issueNumber}`,
    moduleTitle: issue.title,
    summary: issue.description,
    description: `${issue.description} This module walks through the shift, what it means in practice, and the workflow you can apply at work the same day.`,
    objectives: issue.outcomes.slice(0, 4),
    topics,
    prerequisites: "No setup required. Watch along, then try the hands-on demo at the end.",
    estimatedMinutes: issue.durationMinutes,
  };

  const segmentDurations = ["12 Mins", "15 Mins", "10 Mins"];
  const segments: CourseItem[] = topics.map((t, i) => ({
    id: `${moduleId}-v${i + 1}`,
    type: "video",
    title: `Segment ${i + 1}: ${t.title}`,
    duration: segmentDurations[i] ?? "10 Mins",
  }));

  const demo: CourseItem = {
    id: `${moduleId}-demo`,
    type: "video",
    title: `Hands-on demo: ${tool}`,
    duration: "13 Mins",
  };

  return [
    {
      id: `${moduleId}-s1`,
      moduleId,
      label: `Module ${issue.issueNumber}: ${tool}`,
      videosCount: segments.length + 1,
      resourcesCount: 0,
      progress: 0,
      expandedDefault: true,
      items: [overview, ...segments, demo],
    },
  ];
}

export function getModuleItems(moduleId: string): CourseItem[] {
  return getSectionsForModule(moduleId).flatMap((s) => s.items ?? []);
}

export function getItem(moduleId: string, itemId: string): CourseItem | undefined {
  return getModuleItems(moduleId).find((i) => i.id === itemId);
}

export function getSectionForItem(moduleId: string, itemId: string): CourseSection | undefined {
  return getSectionsForModule(moduleId).find((s) => s.items?.some((i) => i.id === itemId));
}

export function getNeighbors(moduleId: string, itemId: string): { prev?: CourseItem; next?: CourseItem } {
  const all = getModuleItems(moduleId);
  const idx = all.findIndex((i) => i.id === itemId);
  if (idx < 0) return {};
  return { prev: all[idx - 1], next: all[idx + 1] };
}

export function getDefaultItemId(moduleId: string, _started: boolean): string {
  const items = getModuleItems(moduleId);
  if (items.length === 0) return "";
  return items[0].id;
}

/**
 * The id of the module's hands-on item (the first, if a module has several parts),
 * or null when the module exposes none. Powers the "Try the hands-on demo" shortcut
 * on the module card — fixed label, destination computed per module.
 */
export function getHandsOnItemId(moduleId: string): string | null {
  const handsOn = getModuleItems(moduleId).find(isHandsOn);
  return handsOn?.id ?? null;
}
