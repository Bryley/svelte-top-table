<script lang="ts">
    import type { SortData } from "$lib/types";
    import { sortRows } from "$lib/utils";
    import type { SvelteComponent } from "svelte";
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

    export let rows: Row[];
    export let sortedColumn: SortData | null;
    export let tableRow: typeof SvelteComponent;
    export let disableClick: (row: Row) => boolean;
    export let rowDisabled: (row: Row) => boolean;
    export let rowHighlighted: (row: Row) => boolean;
    export let isPaginationTable: boolean;
</script>

<tbody>
    {#each sortRows(isPaginationTable ? null : sortedColumn, rows) as row}
        <tr
            class:top-table--clickable={!disableClick(row)}
            class:top-table--disabled={rowDisabled(row)}
            class:top-table--highlighted={rowHighlighted(row)}
            on:click={(e) => {
                if (!disableClick(row)) {
                    dispatch("click", { event: e, row });
                }
            }}
            on:contextmenu|preventDefault={(e) => {
                if (!disableClick(row)) {
                    dispatch("contextmenu", { event: e, row });
                }
            }}
        >
            <svelte:component this={tableRow} {row} />
        </tr>
    {/each}
</tbody>

<style lang="scss">
    tr {
        :global(td) {
            background: var(--top-table--cell-bg);

            &:not(:last-child) {
                border-right: var(--top-table--cell-border);
            }
        }
        &:nth-child(2n) {
            :global(td) {
                background: var(--top-table--cell-bg-alt);
            }
        }

        &:last-child {
            :global(.top-table--group td) {
                border-bottom: var(--top-table--cell-border-group);
            }
        }

        &.top-table--clickable {
            cursor: pointer;

            &:hover {
                :global(td) {
                    background: var(--top-table--cell-bg-hover);
                    color: var(--top-table--cell-fg-hover);
                }
            }
        }

        &.top-table--disabled {
            :global(td) {
                color: var(--top-table--cell-fg-disabled);
                filter: blur(0.03em);
                text-decoration: line-through;
            }
        }
        &.top-table--highlighted {
            :global(td) {
                background: var(--top-table--cell-bg-highlighted);
                border-color: #00000000 !important;
            }
        }
    }
</style>
