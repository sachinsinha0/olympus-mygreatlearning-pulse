import detailJson from "../../mocks/pulseCourseDetail.json";
import type { CourseDetail, CourseItem, CourseSection } from "./types";

const detail = detailJson as CourseDetail;

export function getCourseDetail(): CourseDetail {
  return detail;
}

export function getSectionsForModule(moduleId: string): CourseSection[] {
  return detail.sections.filter((s) => s.moduleId === moduleId);
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
