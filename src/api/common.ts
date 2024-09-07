import { APP_TITLE } from "@/settings";
import { PaginationBase } from "./interface";

export const columnSelectionWidth = 50;
export const columnOperateWidth = 70;

export function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${APP_TITLE}`;
  }
  return `${APP_TITLE}`;
}

export function getColumnWidth(page: PaginationBase | undefined | null) {
  let width = 25;
  if (page === undefined) return width;
  if (page === null) return width;
  if (page.PageIndex === undefined || page.PageSize === undefined) return width;
  if (page.PageIndex === null || page.PageSize === null) return width;

  const max = page.PageIndex * page.PageSize;
  const maxDigits = max.toString().length;
  width = 25 + 5 * maxDigits;

  return width;
}

export function getRowIndex(index: number, query: PaginationBase | null) {
  if (query === null) {
    return index + 1;
  } else {
    let i = query.PageIndex ?? 1;
    i = i - 1;
    const s = query.PageSize ?? 0;
    return i * s + index + 1;
  }
}
