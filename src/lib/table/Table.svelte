<script lang="ts">
    import type {
        ColumnGroup,
        SortData,
        TableColumnData,
        TableContext,
    } from "../types";
    import { setContext, type SvelteComponent } from "svelte";
    import {
        genColumnGroups,
        redraw,
        TABLE_KEY,
        updateStickyColumns,
    } from "$lib/utils";
    import THead from "./THead.svelte";
    import TBody from "./TBody.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // Generic Row type stores row that is fetched.
    type Row = $$Generic<{ [col: string]: any }>;
    interface $$Slots {
        default: {
            // slot name
            item: Row;
            index: string;
        };
    }

    /*
     * Props
     */

    /**
     * The data the table will populate from either from statically defined
     * data or a async function
     */
    export let data: (() => Promise<Row[]>) | Row[];
    /** A svelte component that defines a single row */
    export let tableRow: typeof SvelteComponent;

    /** If the table should fill available space */
    export let fillSpace: boolean = false;

    /** Function that defines what rows should have clicking disabled */
    export let disableClick: (row: Row) => boolean = (_) => false;
    /** Function that defines what rows should be disabled */
    export let rowDisabled: (row: Row) => boolean = (_) => false;
    /** Function that defines what rows should be highlighted */
    export let rowHighlighted: (row: Row) => boolean = (_) => false;

    /**
     * What component to render if there is an error (Component has `error`
     * prop passed in at the error).
     */
    export let errorComp: typeof SvelteComponent | undefined = undefined;
    /** The components to pass into the error component */
    export let errorCompProps: { [key: string]: any } = {};
    /** The sorting column data */
    export let sortedColumn: SortData | null = null;
    /**
     * True if this Table component is inside a PaginationTable
     * (Use PaginationTable.svelte instead)
     */
    export let isPaginationTable: boolean = false;


    /*
     * Variables
     */
    let columns = new Map<string, TableColumnData>();
    let columnGroups: ColumnGroup[] = [];
    let tableElement: HTMLTableElement;
    $: updateStickyColumns(tableElement);

    /*
     * Functions
     */
    async function fetchData(
        data: (() => Promise<Row[]>) | Row[]
    ): Promise<Row[]> {
        return typeof data === "function" ? await data() : data;
    }

    /*
     * Context
     */
    setContext<TableContext>(TABLE_KEY, {
        registerNewColumn: (columnId: string, columnData: TableColumnData) => {
            columns.set(columnId, columnData);
            columnGroups = genColumnGroups([...columns.values()], columnGroups);
        },
        isGroupShown: (group: string | null) => {
            const colGroup = columnGroups.find(
                (colGroup) => colGroup.group === group
            );
            return colGroup?.shown ?? true;
        },
        toggleGroup: (group: string, value?: boolean) => {
            const colGroup = columnGroups.find(
                (colGroup) => colGroup.group === group
            );
            if (colGroup === undefined) {
                return;
            }
            colGroup.shown = value ?? !colGroup.shown;
            columnGroups = columnGroups;
            // TODO trigger redraw
            $redraw = !$redraw;
        },
    });
</script>

<div class="top-table--container" class:top-table--fillSpace={fillSpace}>
    {#await fetchData(data)}
        Loading...
    {:then rows}
        <table bind:this={tableElement}>
            <THead bind:sortedColumn {columnGroups} on:sort={() => dispatch('sort')} />
            <TBody
                on:click={(e) => dispatch("click", e.detail)}
                on:contextmenu={(e) => dispatch("contextmenu", e.detail)}
                {isPaginationTable}
                {sortedColumn}
                {rows}
                {tableRow}
                {disableClick}
                {rowDisabled}
                {rowHighlighted}
            />
        </table>
    {:catch error}
        {#if errorComp != undefined}
            <svelte:component this={errorComp} {error} {...errorCompProps} />
        {:else}
            Error Occured: <pre>{JSON.stringify(error)}</pre>
        {/if}
    {/await}
</div>

<style lang="scss">
    @use "../colors.scss";

    .top-table--container {
        table {
            border-spacing: 0;
            width: 100%;
        }
        &.top-table--fillSpace {
            width: 100%;
        }
    }
</style>
