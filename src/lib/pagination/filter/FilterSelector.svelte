<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { FilterCondition, FilterGroup } from ".";
    import type { FilterColumnData } from "../types";
    import Condition from "./Condition.svelte";
    const dispatch = createEventDispatcher();

    export let filter: FilterGroup;
    export let columnData: { [column: string]: FilterColumnData } = {};

    if (filter == undefined) {
        filter = new FilterGroup();
    }

    let valids: boolean[] = [];

    export let valid: boolean = false;
    $: valid = valids.every((v) => v);

    function addFilter(type: "condition" | "group") {
        const newFilter =
            type === "condition" ? new FilterCondition() : new FilterGroup();
        filter.add(newFilter);
        filter = filter;
        change();
    }

    function removeFilter(index: number) {
        filter.remove(index);
        filter = filter;

        // If the group is empty then remove entire group from parent
        if (filter.filters.length <= 0) {
            dispatch("remove");
        }
        change();
    }

    function change() {
        dispatch('change');
    }
</script>

<!-- TODO NTS: And working here as well -->
<div class="top-table--filter-group">
    {#each filter.filters as childFilter, index (childFilter.id)}
        {#if childFilter instanceof FilterCondition}
            <Condition
                {columnData}
                bind:columnName={childFilter.columnName}
                bind:operator={childFilter.condition}
                bind:value={childFilter.value}
                bind:valid={valids[index]}
                on:remove={(_) => removeFilter(index)}
                on:change={change}
            />
        {:else if childFilter instanceof FilterGroup}
            <div class="indent">
                <svelte:self
                    bind:filter={childFilter}
                    {columnData}
                    bind:valid={valids[index]}
                    on:remove={(_) => removeFilter(index)}
                    on:change={change}
                />
            </div>
        {/if}
        {#if index < filter.filters.length - 1}
            <select
                value={filter.relationships[index]}
                on:change={async (e) => {
                    // This is because of the way relationships doesnt update
                    // @ts-ignore
                    filter.setRelationship(index, e.target?.value);
                    filter = filter;
                    change();
                }}
            >
                <option value={"AND"}>AND</option>
                <option value={"OR"}>OR</option>
            </select>
        {/if}
    {/each}
    <div>
        <button on:click={() => addFilter("condition")}> Add Filter </button>
        <button on:click={() => addFilter("group")}> Add Filter Group </button>
    </div>
</div>

<style lang="scss">
    .top-table--filter-group {
        width: 100%;

        display: flex;
        flex-direction: column;

        border-radius: 10px;
        box-shadow: var(--top-table--filter-group-box-shadow);
        padding: 1em;
        border: var(--top-table--filter-border);

        > div:not(.indent) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2em;
        }

        select {
            margin-block: 10px;
        }

        :global(option) {
            background: var(--top-table--filter-select-bg);
            color: var(--top-table--filter-select-fg) !important;
        }

        :global(select), :global(input) {
            font-size: 1em;
            padding: 0.4em 0.5em;
            border-radius: 5px;
            background: var(--top-table--filter-select-bg);
            color: var(--top-table--filter-select-fg) !important;
            height: 80%;
        }

        button {
            margin-top: 1em;
            font-size: 1em;
            background: var(--top-table--button-bg);
            color: var(--top-table--button-fg);
            border: none;
            padding-block: 0.7em;
            border-radius: 10px;
            cursor: pointer;

            &:hover {
                background: var(--top-table--button-bg-hover);
                color: var(--top-table--button-fg-hover);
            }
        }
    }
</style>
