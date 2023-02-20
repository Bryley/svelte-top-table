import type { ConditionOperator } from "../types";

/**
 * filter.ts
 * ---------
 * This file contains interfaces for the filter system.
 * The filter system is used for end users to have full flexibiliy of finding
 * certain data within a system, filtering down to particular results they
 * are looking for.
 *
 * Filters are stored by using an abstract parent class called Filter which has
 * 2 children:
 *
 * - FilterCondition
 * - FilterGroup
 *
 * A FilterCondition is the most primative type of filter which contains a basic
 * condition for the search to meet, such as, the 'result' column being greater
 * than 5.
 * A FilterGroup is a list of filters that are grouped together these filters
 * are either conditions or more filter groups to create a tree like recursive
 * structure. Here is an example layout:
 *
 *                              FilterGroup
 *                                   |
 *                    +--------+-----+--------+-----+
 *                    |        |              |     |
 *      FilterCondition FilterCondition FilterGroup FilterCondition
 *                                            |
 *                                          +-+-+
 *                                          |   |
 *                            FilterCondition   FilterCondition
 *
 */

type FilterEncoding = FilterConditionEncoding | FilterGroupEncoding;

interface FilterConditionEncoding {
    columnName: string | null;
    condition: ConditionOperator;
    value: number | string | boolean;
}

interface FilterGroupEncoding {
    filters: FilterEncoding[];
    ors: number[];
}

function isFilterConditionEncoding(
    object: any
): object is FilterConditionEncoding {
    return "columnName" in object && "condition" in object && "value" in object;
}

function isFilterGroupEncoding(object: any): object is FilterGroupEncoding {
    return "filters" in object && "ors" in object;
}

export abstract class Filter {
    private static idCounter: number = 0;
    private _id: number;

    constructor() {
        this._id = Filter.idCounter++;
    }

    public get id() {
        return this._id;
    }

    /**
     * Creates a clone of the class instance.
     */
    public clone(): typeof this {
        return Filter.decode(this.encode()) as typeof this;
    }

    /**
     * Encodes filter to an object that can be encoded as JSON and sent to
     * backend.
     *
     * @returns Object encoding.
     */
    public abstract encode(): FilterEncoding;

    /**
     * Decodes an encoding to a filter object.
     * @param encoding : The encoding to convert.
     * @returns The new filter
     */
    public static decode(encoding: FilterEncoding): Filter {
        if (isFilterConditionEncoding(encoding)) {
            return new FilterCondition(encoding);
        }
        if (isFilterGroupEncoding(encoding)) {
            return new FilterGroup(encoding);
        }
        throw "Failed to decode, encoding is neither a group nor condition";
    }

    public search<T extends {[key: string]: any}>(rows: T[]): T[] {
        return rows.filter((row) => this.matches(row));
    }

    public abstract matches<T extends {[key: string]: any}>(row: T): boolean;
}

export class FilterGroup extends Filter {
    private _filters: Filter[];
    /**
     * The index's where or's follow, eg. [3] = ands folow all filters except
     * for the _filters[3] filter:
     * A and B and C and D or E and ...
     */
    private _ors: number[];

    constructor(encoding?: FilterGroupEncoding) {
        super();
        this._filters =
            encoding?.filters.map((enc) => Filter.decode(enc)) ?? [];
        this._ors = encoding?.ors ?? [];
    }

    /**
     * @returns The filters apart of the group in order.
     */
    public get filters() {
        return this._filters;
    }

    /**
     * Add a filter to the group.
     * @param filter : The new filter to add.
     */
    public add(filter: Filter) {
        this._filters.push(filter);
    }

    /**
     * Remove a filter from the group.
     * This method will also handle removing any relationships that follow the
     * filter like AND or OR.
     * @param index : The index of the filter to remove.
     */
    public remove(index: number) {
        const relationships = [...this.relationships];
        this._filters.splice(index, 1);
        this.relationships = relationships;
    }

    /**
     * Will return if the relationship with the next node if it exists or
     * returns null. Eg. Given filters A to G:
     * @example
     * A and B and C or D or E and F or G
     * The output are for the given inputs:
     *      0 => "AND" (follow A)
     *      1 => "AND" (follow B)
     *      2 => "OR"  (follow C)
     *      3 => "OR"  (follow D)
     *      4 => "AND" (follow E)
     *      5 => "OR"  (follow F)
     *      6 => null  (follow G) (out of bounds)
     *
     *  @param index : The index of the filter to check.
     *  @returns "AND", "OR" for the given position or null if position is out
     *  of bounds.
     */
    public getRelationship(index: number): "AND" | "OR" | null {
        if (index < 0 || index >= this._filters.length - 1) {
            return null;
        }
        return this._ors[index] !== undefined ? "OR" : "AND";
    }

    /**
     * @param index - Index to update
     * @param value - The new value to update too
     */
    public setRelationship(index: number, value: "AND" | "OR") {
        const relationships = [...this.relationships];
        relationships[index] = value;
        this.relationships = relationships;
    }

    /**
     * Gets a easy to read list of relationships to each of the filters.
     * @example
     * Given filtergroup:
     * A and B and C or D or E and F or G
     * The output would be:
     * ["AND", "AND", "OR", "OR", "AND", "OR"]
     * @returns Ordered list of relationships
     */
    public get relationships(): ("AND" | "OR")[] {
        return this._filters
            .map((_, index) => {
                if (index >= this._filters.length - 1) return null;
                return this._ors.includes(index) ? "OR" : "AND";
            })
            .filter((v) => v !== null) as ("AND" | "OR")[];
    }
    public set relationships(relationships: ("AND" | "OR")[]) {
        this._ors = relationships
            .map((item, index) => (item === "OR" ? index : null))
            .filter((item) => item !== null) as number[];
    }

    /** Return groups filters based on AND clauses.
     * Eg.
     * With Filters 1,2,3,4,5 amd ors [1,3]
     * [[1,2], [3,4], [5]]
     */
    public getAndGroups(): (Filter[])[] {
        const results: (Filter[])[] = [];
        let currentGroup: Filter[] = []
        this.filters.forEach((val, index) => {
            currentGroup.push(val);
            if (this._ors.includes(index)) {
                results.push([...currentGroup]);
                currentGroup = [];
            }
        });
        results.push([...currentGroup]);
        return results.filter(v => v.length !== 0);
    }

    public encode(): FilterEncoding {
        return {
            filters: this._filters.map((filter) => filter.encode()),
            ors: this._ors,
        };
    }
    public matches<T extends {[key: string]: any}>(row: T): boolean {
        if (this.filters.length === 0) {
            return true;
        }
        return this.getAndGroups().some(group => {
            return group.every(filter => filter.matches(row));
        });
    }
}

export class FilterCondition extends Filter {
    /** The column name, null = not set yet */
    private _columnName: string | null;
    private _condition: ConditionOperator;
    private _value: number | string | boolean;

    constructor(encoding?: FilterConditionEncoding) {
        super();
        this._columnName = encoding?.columnName ?? null;
        this._condition = encoding?.condition ?? "=";
        this._value = encoding?.value ?? "";
    }

    public get columnName() {
        return this._columnName;
    }
    public set columnName(colName: string | null) {
        this._columnName = colName;
    }

    public get condition() {
        return this._condition;
    }
    public set condition(condition: ConditionOperator) {
        this._condition = condition;
    }
    public get value() {
        return this._value;
    }
    public set value(value: number | string | boolean) {
        this._value = value;
    }

    public encode(): FilterEncoding {
        return {
            columnName: this._columnName,
            condition: this._condition,
            value: this._value,
        };
    }

    public matches<T extends {[key: string]: any}>(row: T): boolean {
        if (this.columnName == null) {
            return false;
        }
        return ({
            "=": (a: any, b: any) => a === b,
            "!=": (a: any, b: any) => a !== b,
            "<": (a: any, b: any) => a < b,
            "<=": (a: any, b: any) => a <= b,
            ">": (a: any, b: any) => a > b,
            ">=": (a: any, b: any) => a >= b,
            "IS": (a: any, b: any) => (b === 'NULL' ? a == null : a != null),
        } as any)[this.condition](row[this.columnName], this.value);
    }
}
