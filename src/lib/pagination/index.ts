import { FilterGroup } from "./filter";
import { PaginationInput } from "./types";

export const DEFAULT_PAGINATION_INPUT = (maxResults: number) => new PaginationInput({
    maxResults: maxResults,
    page: 0,
    sortBy: undefined,
    sortDirection: "ASC",
    filter: new FilterGroup(),
});
