<script lang="ts">
    import { redraw, TABLE_KEY } from "$lib/utils";
    import { getContext, onDestroy, setContext } from "svelte";
    import type { TableColumnData, TableContext } from "../types";

    /** The name of the group */
    export let name: string;

    const parentContext = getContext<TableContext>(TABLE_KEY);

    setContext<TableContext>(TABLE_KEY, {
        ...parentContext,
        registerNewColumn: (columnId: string, columnData: TableColumnData) => {
            columnData.group = name;
            parentContext.registerNewColumn(columnId, columnData);
        },
    });

    let groupShown: boolean = parentContext.isGroupShown(name);
    onDestroy(
        redraw.subscribe((_) => {
            groupShown = parentContext.isGroupShown(name);
        })
    );
</script>

<div class="top-table--group">
    {#if groupShown}
        <slot />
    {:else}
        <td></td>
    {/if}
</div>

<style lang="scss">
    div {
        display: contents;

        :global(td:first-child) {
            border-left: var(--top-table--cell-border-group);
        }
        :global(td:last-child) {
            border-right: var(--top-table--cell-border-group);
        }
    }
</style>
