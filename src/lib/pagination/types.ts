import type { SortData } from "$lib/types";
import { Filter, type FilterGroup } from "./filter";

export interface FilterColumnData {
    displayName: string;
    type: "string" | "number" | "boolean" | "category";
    isValid?: ((value: any) => Promise<boolean>) | undefined;
    categories?: () => Promise<string[]> | undefined;
}

// Operators
export const OPERATORS = ["=", "!=", "<", "<=", ">", ">=", "IS"];
export type ConditionOperator = (typeof OPERATORS)[number];

export function getOperators(
    colType: "string" | "number" | "boolean" | "category"
): ConditionOperator[] {
    return [
        "=", "!=", "IS",
        ...(colType === 'number' ? ["<", "<=", ">", ">="] : [])
    ];
}

export interface Pagination<T> {
    pageInfo: PageInfo;
    results: T[];
}
export interface PageInfo {
    totalResults: number;
}

export class PaginationInput {
    maxResults: number;
    page: number;
    sort: SortData | null;
    filter: FilterGroup;

    constructor(obj: any) {
        this.maxResults = obj.maxResults;
        this.page = obj.page;
        this.sort = obj.sort;
        if (typeof obj.filter == "string") {
            this.filter = Filter.decode(JSON.parse(obj.filter)) as FilterGroup;
        } else {
            this.filter = obj.filter;
        }
    }

    urlEncode(): string {
        return encodeURIComponent(
            JSON.stringify({
                ...this,
                filter: JSON.stringify(this.filter.encode()),
            })
        );
    }
}
