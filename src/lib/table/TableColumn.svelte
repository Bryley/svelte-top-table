<script lang="ts">
    import { TABLE_KEY } from "$lib/utils";
    import { getContext } from "svelte";
    import type { TableContext } from "../types";

    /** The displayed title in header */
    export let title: string = "";
    /** The unique column id for this table (also used by sorting) */
    export let id: string = title;

    /** If the column should be sticky */
    export let sticky: boolean = false;
    /** If the column is allowed to be sorted by */
    export let sortable: boolean = false;

    const parentContext = getContext<TableContext>(TABLE_KEY);
    parentContext.registerNewColumn(id, {
        id,
        title,
        width: null,
        sticky,
        sortable,
        group: null,
    });
</script>

<td class:top-table--sticky={sticky}>
    <div>
        <slot />
    </div>
</td>

<style lang="scss">
    td {
        max-height: 100%;

        div {
            display: flex;
            padding: 1.2em;
            flex-direction: column;
            white-space: nowrap;
        }

        &.top-table--sticky {
            position: sticky;
            z-index: 15;
            left: 0;
        }
    }
</style>
