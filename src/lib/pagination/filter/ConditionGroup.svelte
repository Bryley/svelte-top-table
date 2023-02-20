<!--
TODO this is probably not used anymore delete it please
This component handles displaying the 'FilterGroup' object to the user
-->
<script lang="ts" context="module">
    import { FilterGroup, FilterCondition } from ".";
    import type { FilterColumnData } from "../types";
    import Condition from "./Condition.svelte";
    import { createEventDispatcher } from "svelte";
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();

    export let filterGroup: FilterGroup;
    export let columnData: FilterColumnData[];
    export let fetchCategories: (column: string) => Promise<string[]>;

    /** This variable stores nothing but will be toggled whenever a user changes
        anything and is used for reactivity */
    let userChange: boolean = false;
    let filterComponents: any[] = [];

    function addFilter(type: "condition" | "group") {
        const newFilter =
            type === "condition" ? new FilterCondition() : new FilterGroup();
        filterGroup.add(newFilter);
        if (filterGroup.filters.length > 1) {
            relationships.push("AND");
        }
        filterGroup = filterGroup;
    }

    function removeFilter(index: number) {
        filterGroup.remove(index);
        relationships = [...filterGroup.relationships];
        filterGroup = filterGroup;

        // If the group is empty then remove entire group from parent
        if (filterGroup.filters.length <= 0) {
            dispatch("remove");
        }
    }

    let validStates: boolean[] = [];
    $: dispatch(
        "validChange",
        validStates.every((v) => v)
    );

    let relationships = [...filterGroup.relationships];
    $: filterGroup.relationships = relationships;
</script>

<div class="top-table--filter-condition">
    {#each filterGroup.filters as childFilter, index (childFilter.id)}
        {#if childFilter instanceof FilterCondition}
            <Condition
                bind:this={filterComponents[index]}
                condition={childFilter}
                {columnData}
                {fetchCategories}
                on:remove={(_) => removeFilter(index)}
                on:validChange={(e) => (validStates[index] = e.detail)}
                on:change={() => (userChange = !userChange)}
            />
        {:else if childFilter instanceof FilterGroup}
            <div class="indent">
                <svelte:self
                    bind:this={filterComponents[index]}
                    filterGroup={childFilter}
                    {columnData}
                    {fetchCategories}
                    on:remove={(_) => removeFilter(index)}
                    on:validChange={(e) => (validStates[index] = e.detail)}
                />
            </div>
        {/if}
        {#if relationships[index] !== undefined}
            <select bind:value={relationships[index]}>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
        {/if}
    {/each}

    <div class="add-btns">
        <button on:click={() => addFilter("condition")}>
            <span class="material-symbols-outlined"> add </span>
            <span>Add filter</span>
        </button>
        <button on:click={() => addFilter("group")}>
            <span class="material-symbols-outlined"> library_add </span>
            <span>Add filter group</span>
        </button>
    </div>
</div>

<style>
    .add-btns {
        margin-top: 15px;
        display: flex;
        flex-direction: row;
    }
    .add-btns > button {
        flex: 1;
    }

    .indent {
        margin-left: 0.5em;
        border: #8c8c8c69 solid 3px;
        border-radius: 10px;
        padding: 15px;
        box-shadow: inset 0px 0px 7px 3px #66666624;
    }

    :global(select, input) {
        border: #70707059 solid 1px;
        border-radius: 5px;
        padding: 5px;
        font-size: 1em;
        background: none;
        margin-inline: 10px;
        margin-block: 0.5em;
    }
</style>
