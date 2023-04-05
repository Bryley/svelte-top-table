<script lang="ts">
    import { createEventDispatcher, type SvelteComponent } from "svelte";
    import { DEFAULT_PAGINATION_INPUT } from ".";
    import PageButtons from "./PageButtons.svelte";
    import type { Pagination, PaginationInput } from "./types";
    import Table from "../table/Table.svelte";
    const dispatch = createEventDispatcher();

    type Row = $$Generic;
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
     * The data the table will populate from a async function with a search param
     */
    export let data: (search: PaginationInput) => Promise<Pagination<Row>>;
    /** A svelte component that defines a single row */
    export let tableRow: typeof SvelteComponent;

    /** A list of row sizes that are available to display */
    export let rowSizes: number[] = [10, 30, 50, 100];

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

    /*
     * Variables
     */
    export let search: PaginationInput = DEFAULT_PAGINATION_INPUT(rowSizes[0]);

    let dataFetch: Promise<Pagination<Row>> = data(search);

    /*
     * Functions
     */
    function getTotalPages(totalResults: number): number {
        return Math.ceil(totalResults / search.maxResults);
    }

    export function change() {
        dataFetch = data(search);
    }
</script>

<div class="top-table--pagination-table-group">
    <div class="top-table--row-data">
        Showing rows
        {search.page * search.maxResults + 1}
        -
        {#await dataFetch}
            ?
        {:then pagination}
            {search.page * search.maxResults + pagination.results.length}
        {/await}
        of
        {#await dataFetch}
            ?
        {:then pagination}
            {pagination.pageInfo.totalResults}
        {/await}
    </div>

    <div class="top-table--pagination-table">
        {#await dataFetch}
            <!-- TODO make this better more space or probably use a slot -->
            <slot name="loading">Loading...</slot>
        {:then pagination}
            <Table
                data={pagination.results}
                on:click={(e) => dispatch("click", e.detail)}
                on:contextmenu={(e) => dispatch("contextmenu", e.detail)}
                on:sort={change}
                bind:sortedColumn={search.sort}
                isPaginationTable={true}
                {tableRow}
                {fillSpace}
                {disableClick}
                {rowDisabled}
                {rowHighlighted}
            />
        {:catch error}
            {#if errorComp != undefined}
                <svelte:component
                    this={errorComp}
                    {error}
                    {...errorCompProps}
                />
            {:else}
                <pre>{JSON.stringify(error)}</pre>
            {/if}
        {/await}
    </div>

    <div class="top-table--page-btns">
        {#await dataFetch}
            <PageButtons bind:page={search.page} on:change={change}>
                <slot slot="nav-before" name="nav-before">&lt;</slot>
                <slot slot="nav-after" name="nav-after">&gt;</slot>
            </PageButtons>
        {:then pagination}
            <PageButtons
                bind:page={search.page}
                on:change={change}
                pageMax={getTotalPages(pagination.pageInfo.totalResults)}
            >
                <slot slot="nav-before" name="nav-before">&lt;</slot>
                <slot slot="nav-after" name="nav-after">&gt;</slot>
            </PageButtons>
        {/await}
    </div>
    <div class="top-table--max-results">
        <span>Show</span>
        <select
            bind:value={search.maxResults}
            on:change={() => {search.page = 0; change()}}
        >
            {#each rowSizes as rowSize}
                <option value={rowSize}>{rowSize}</option>
            {/each}
        </select>
        <span>Rows</span>
    </div>
</div>

<style lang="scss">
    .top-table--pagination-table-group {
        display: grid;
        grid-template-columns: auto 1fr auto;

        .top-table--row-data {
            grid-row: 1;
            grid-column: 1;
        }

        .top-table--pagination-table {
            grid-row: 2;
            grid-column: 1 / -1;
            overflow: auto;
        }

        .top-table--page-btns {
            grid-row: 3;
            grid-column: 1;
        }

        .top-table--max-results {
            grid-row: 3;
            grid-column: 3;

            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3px;
            place-items: center;

            select, option {
                background: var(--top-table--filter-select-bg);
                color: var(--top-table--filter-select-fg);
            }
        }
    }
</style>
