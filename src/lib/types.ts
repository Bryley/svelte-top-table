export interface TableColumnData {
    id: string;
    title: string;
    width: number | null;
    sticky: boolean;
    sortable: boolean;
    group: string | null;
}

export interface TableContext {
    registerNewColumn: (columnId: string, columnData: TableColumnData) => void;
    isGroupShown: (group: string | null) => boolean;
    toggleGroup: (group: string, value?: boolean) => void;
}

export interface ColumnGroup {
    group: string | null;
    columns: TableColumnData[];
    shown: boolean;
}

export const SORT_OPTIONS = ['DESC', 'ASC'] as const;
export type SortDirection = typeof SORT_OPTIONS[number];

export interface SortData {
    column: string;
    direction: SortDirection;
}
