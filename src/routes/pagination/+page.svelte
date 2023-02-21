<script lang="ts">
    import FilterSelector from "$lib/pagination/filter/FilterSelector.svelte";
    import type { Pagination, PaginationInput } from "$lib/pagination/types";
    import {PaginationTable} from "$lib";
    import { type Number, getNumber, COLUMN_DATA } from "../example-data/number";
    import NumberRow from "./NumberRow.svelte";

    async function data(search: PaginationInput): Promise<Pagination<Number>> {
        /* await new Promise(res => setTimeout(res, 5000)); */
        const startIndex = search.page * search.maxResults;
        const endIndex = startIndex + search.maxResults;

        const numbers = search.filter.search(
            Array.from({length: 10000}, (_, i) => getNumber(i))
        );

        return {
            results: numbers.slice(startIndex, endIndex),
            pageInfo: {
                totalResults: numbers.length,
            },
        };
    }

    let valid: boolean;
    let search: PaginationInput | undefined;
</script>

<div>
    <PaginationTable {data} bind:search tableRow={NumberRow} />
</div>

<pre>{JSON.stringify(search?.filter.encode())}</pre>
<pre>{JSON.stringify(search?.filter.getAndGroups())}</pre>
<span>Valid: {valid}</span>

<!-- TODO NTS: Working on the FilterSelector part -->
{#if search?.filter != undefined}
    <div>
        <FilterSelector
            bind:filter={search.filter}
            bind:valid={valid}
            columnData={COLUMN_DATA}
        />
    </div>
{/if}

<style lang="scss">
    div {
        border: 2px solid black;
        resize: both;
        width: 80vw;
        overflow: auto;
    }
    pre {
        overflow: auto;
    }
</style>
