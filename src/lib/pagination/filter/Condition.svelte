<!--
This component handles displaying a 'FilterCondition' to the user
-->
<script lang="ts" context="module">
    import type { FilterCondition } from ".";
    import {
        type ConditionOperator,
        type FilterColumnData,
        OPERATORS,
        getOperators,
    } from "../types";
    import { createEventDispatcher } from "svelte";
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();

    export let columnData: { [column: string]: FilterColumnData };

    export let columnName: string | null;
    export let operator: ConditionOperator;
    export let value: string | number | boolean;

    export let valid: boolean = false;

    function isValid(
        columnName: string | null,
        operator: ConditionOperator,
        value: string | number | boolean
    ): boolean {
        return !(
            columnName === null ||
            columnName === undefined ||
            value === null ||
            value === undefined ||
            (operator === "IS" &&
                !["NULL", "NOT NULL"].includes(value as string)) ||
            (getSelectedColumnType(columnName) === "number" &&
                isNaN(parseFloat(value as string)) &&
                operator !== "IS") ||
            (operator !== "IS" &&
                getSelectedColumnType(columnName) !== "category" &&
                getSelectedColumnType(columnName) !== typeof value) ||
            (getSelectedColumnType(columnName) === "category" && value === "")
        );
    }

    $: valid = isValid(columnName, operator, value);

    function getSelectedColumnType(
        selectedCol: string | null
    ): "boolean" | "string" | "number" | "category" | undefined {
        return columnData[selectedCol ?? ""]?.type;
    }

    /* $: columnType = getSelectedColumnType(columnName); */
    $: columnType = columnData[columnName ?? ""]?.type;

    let categories: string[] | null = null;
    async function populateCategories(selectedColumnName: string | null) {
        if (selectedColumnName == null) {
            return;
        }
        categories = null;
        categories =
            (await columnData[selectedColumnName]?.categories?.()) ?? null;
    }
    $: populateCategories(columnName);

    function change() {
        dispatch('change');
    }
</script>

<div class="top-table--condition" class:valid>
    <!-- Column Select -->
    <select bind:value={columnName} on:change={change}>
        <option value={null}> - </option>
        {#each Object.entries(columnData) as [col, colData]}
            <option value={col}>
                {colData.displayName}
            </option>
        {/each}
    </select>

    {#if columnName !== null}
        <!-- Operator Select -->
        <select bind:value={operator} on:change={change}>
            {#each getOperators(columnType) as op (op)}
                <option value={op}>{op}</option>
            {/each}
        </select>

        <!-- Value Select -->
        {#if operator === "IS"}
            <select bind:value on:change={change}>
                <option value="NULL">NULL</option>
                <option value="NOT NULL">NOT NULL</option>
            </select>
        {:else if columnType === "boolean"}
            <select bind:value on:change={change}>
                <option value={true}>True</option>
                <option value={false}>False</option>
            </select>
        {:else if columnType === "number"}
            <input type="number" bind:value placeholder="Value" on:change={change}/>
        {:else if columnType === "category"}
            {#if categories == null}
                Loading...
            {:else}
                <select bind:value on:change={change}>
                    {#each categories as category (category)}
                        <option value={category}>{category}</option>
                    {/each}
                </select>
            {/if}
        {:else}
            <div>
                <span class="quotes">"</span>
                <input type="text" bind:value placeholder="Value" on:change={change} />
                <span class="quotes">"</span>
            </div>
        {/if}
    {/if}

    <button class="top-table--delete-btn" on:click={() => dispatch("remove")}>
        &times;
    </button>
</div>

<style lang="scss">
    .top-table--condition {

        display: grid;
        grid-template-columns: 30% 3.5em 30% 1fr 5em;
        gap: 5px;
        

        /* display: flex; */
        /* flex-direction: row; */
        /* align-items: center; */
        /* justify-content: space-between; */

        border-radius: 10px;
        padding: 1em 2em;
        border: var(--top-table--filter-border);

        .quotes {
            font-size: 1.5em;
        }


        &:not(.valid) {
            border-color: var(--top-table--filter-invalid);
            border-radius: 10px;
        }

        button {
            grid-column: -1;
            aspect-ratio: 1;
            border-radius: 50%;
            vertical-align: middle;
            font-size: 1.5em;
            background: none;
            border: none;

            &:hover {
                background: var(--top-table--button-bg-hover);
                color: var(--top-table--button-fg-hover);
            }
        }
    }
</style>
