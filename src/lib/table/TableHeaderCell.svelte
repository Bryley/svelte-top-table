<script lang="ts">
    import {
        SORT_OPTIONS,
        type SortDirection,
        type TableColumnData,
    } from "$lib/types";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let column: TableColumnData;
    export let sort: SortDirection | null;

    let showOptions: boolean = sort != null;

    function mouseEnter() {
        showOptions = true;
    }
    function mouseLeave() {
        if (sort === null) {
            showOptions = false;
        }
    }

    $: (_ => mouseLeave())(sort);

    function click() {
        const OPTS = [...SORT_OPTIONS, null];
        const newDirection = OPTS[(OPTS.indexOf(sort) + 1) % 3];

        dispatch("sort", newDirection);
    }
</script>

<div on:mouseenter={mouseEnter} on:mouseleave={mouseLeave}>
    <span>{column.title}</span>
    {#if column.sortable && showOptions}
        <button on:click|stopPropagation={click}>
            <svg viewBox="0 0 2 2">
                {#if sort === "ASC" || sort === null}
                    <path d="M 0 0.9 H 2 L 1 0 Z" />
                {/if}
                {#if sort === "DESC" || sort === null}
                    <path d="M 0 1.1 H 2 L 1 2 Z" />
                {/if}
            </svg>
        </button>
    {/if}
</div>

<style lang="scss">
    div {
        display: grid;
        grid-template-columns: 1fr 25px;
        justify-items: start;
        align-items: center;
        gap: 1em;

        padding: 0.4em 1.2em;
        font-size: 1em;
        font-weight: 500;

        button {
            display: flex;
            justify-content: center;
            align-items: center;

            height: 25px;
            padding: 20%;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            background: var(--top-table--sort-button-bg);
            color: var(--top-table--sort-button-fg);

            &:hover {
                background: var(--top-table--sort-button-bg-hover);
                color: var(--top-table--sort-button-fg-hover);

                * {
                    fill: var(--top-table--sort-button-fg-hover);
                }
            }

            svg {
                width: 100%;
                opacity: 0.5;
                path {
                    fill: var(--top-table--sort-button-fg);
                }
            }
        }
    }
</style>
