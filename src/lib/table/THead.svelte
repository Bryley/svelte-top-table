<script lang="ts">
    import { TABLE_KEY } from "$lib/utils";
    import type { TableContext, ColumnGroup, SortData, SortDirection } from "$lib/types";
    import { getContext } from "svelte";
    import TableHeaderCell from "./TableHeaderCell.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let columnGroups: ColumnGroup[];

    const parentContext = getContext<TableContext>(TABLE_KEY);

    export let sortedColumn: SortData | null = null;

    function sort(column: string, direction: SortDirection | null) {
        sortedColumn = direction !== null ? {
            column,
            direction
        } : null;
        dispatch('sort');
    }
</script>

<thead>
    <tr>
        {#each columnGroups as colGroup}
            {#if colGroup.shown}
                <div
                    on:keypress={() => {}}
                    on:click={() => {
                        if (colGroup.group !== null)
                            parentContext.toggleGroup(colGroup.group, false);
                    }}
                    class:top-table--group={colGroup.group !== null}
                >
                    {#each colGroup.columns as column}
                        <th class:top-table--sticky={column.sticky}>
                            <TableHeaderCell
                                sort={sortedColumn?.column === column.id
                                    ? sortedColumn.direction
                                    : null}
                                on:sort={e => sort(column.id, e.detail)}
                                {column}
                            />
                        </th>
                    {/each}
                </div>
            {:else}
                <div
                    on:keypress={() => {}}
                    on:click={() => {
                        if (colGroup.group !== null)
                            parentContext.toggleGroup(colGroup.group, true);
                    }}
                    class:top-table--group={colGroup.group !== null}
                >
                    <th> ... </th>
                </div>
            {/if}
        {/each}
    </tr>
</thead>

<style lang="scss">
    div {
        display: contents;

        &:first-child th:first-child {
            border-radius: 10px 0px 0px 0px;
        }
        &:last-child th:last-child {
            border-radius: 0px 10px 0px 0px;
        }

        th {
            position: sticky;
            z-index: 1;
            top: 0;
            background: var(--top-table--header-bg);
            color: var(--top-table--header-fg);
            vertical-align: middle;
            width: 0px; // This will cause the width of the col to be
            // determined by the contents of the cells in the column
            // background: var(--top-table--header-bg);

            &.top-table--sticky {
                z-index: 20;
                left: 0;
            }
        }

        &.top-table--group {
            cursor: pointer;

            th:first-child {
                border-left: var(--top-table--header-border-group);
            }
            th:last-child {
                border-right: var(--top-table--header-border-group);
            }

            th {
                background: var(--top-table--header-bg-group);
                color: var(--top-table--header-fg-group);
                border-top: var(--top-table--header-border-group);
                border-bottom: var(--top-table--header-border-group);
            }
            &:hover {
                th {
                    background: var(--top-table--header-bg-group-hover);
                    color: var(--top-table--header-fg-group-hover);
                }
            }
        }
    }
</style>
