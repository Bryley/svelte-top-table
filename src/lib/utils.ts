import type { ColumnGroup, SortData, TableColumnData } from "./types";
import { writable } from "svelte/store";

export const TABLE_KEY = Symbol();

export const redraw = writable<boolean>(false);

export function genColumnGroups(columns: TableColumnData[]): ColumnGroup[] {
    const columnGroups: ColumnGroup[] = [];
    let currentGroup: ColumnGroup | null = null;

    for (const col of columns) {
        if (currentGroup === null || col.group !== currentGroup.group) {
            if (currentGroup !== null) columnGroups.push(currentGroup);
            currentGroup = {
                group: col.group,
                columns: [col],
                shown: true,
            };
            continue;
        }
        currentGroup.columns.push(col);
    }
    if (currentGroup !== null) columnGroups.push(currentGroup);
    return columnGroups;
}

/**
 * Updates cells to be sticky if they have the .sticky class
 */
export function updateStickyColumns(tableElement: HTMLTableElement) {
    const scrollableElement = tableElement?.parentElement;
    if (!scrollableElement) return;
    scrollableElement.scrollTo(0, 0); // Reset scrolling

    const scrollableXOffset = scrollableElement.getBoundingClientRect().x;

    const cells = tableElement.querySelectorAll(".top-table--sticky");

    cells.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        const xOffset = htmlEl.getBoundingClientRect().x - scrollableXOffset;
        htmlEl.style.left = xOffset + "px";
    });
}

export function universalCompare(item1: any, item2: any): number {
    const type1 = typeof item1;
    const type2 = typeof item2;

    if (type1 !== type2) {
        // Compare types if the types don't match
        return type1.localeCompare(type2);
    }

    if (type1 === "undefined") {
        return 0;
    } else if (type1 === "string") {
        return item1.localeCompare(item2);
    } else if (
        type1 === "number" ||
        type1 === "bigint" ||
        item1 === "boolean"
    ) {
        const comp = (item1 - item2) / Math.abs(item1 - item2);
        return isFinite(comp) ? comp : 0;
    } else {
        if (item1 == null) {
            item1 = "null";
        }
        if (item2 == null) {
            item2 = "null";
        }
        return item1.toString().localeCompare(item2.toString());
    }
}

export function sortRows<T extends { [col: string]: any }>(
    sortedColumn: SortData | null,
    rows: T[]
): T[] {
    if (sortedColumn == null) {
        return rows;
    }
    const mod = sortedColumn.direction == "ASC" ? -1 : 1;
    return [...rows].sort((a, b) => {
        const col1 = a[(sortedColumn as SortData).column];
        const col2 = b[(sortedColumn as SortData).column];
        return mod * universalCompare(col1, col2);
    });
}
