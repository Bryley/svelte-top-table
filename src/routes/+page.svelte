<script lang="ts">
    import { PaginationTable, Table } from "$lib";
    import FilterSelector from "$lib/pagination/filter/FilterSelector.svelte";
    import type { Pagination, PaginationInput } from "$lib/pagination/types";
    import { sortRows } from "$lib/utils";
    import { COLUMN_DATA, getNumber, type Number } from "./example-data/number";
    import { languages } from "./example-data/programming";
    import MovieRow from "./MovieRow.svelte";
    import NumberRow from "./pagination/NumberRow.svelte";
    import ProgrammingLanguageRow from "./ProgrammingLanguageRow.svelte";
    import { searchMovies } from "./utils";

    let movieSearch: string;
    let search: PaginationInput | undefined;

    async function numberData(
        search: PaginationInput
    ): Promise<Pagination<Number>> {
        // This will usually be some kind of SQL instead
        await new Promise((res) => setTimeout(res, 100));
        const startIndex = search.page * search.maxResults;
        const endIndex = startIndex + search.maxResults;

        const numbers = sortRows(search.sort, search.filter.search(
            Array.from({ length: 10000 }, (_, i) => getNumber(i))
        ));

        return {
            results: numbers.slice(startIndex, endIndex),
            pageInfo: {
                totalResults: numbers.length,
            },
        };
    }
    let pageTable: PaginationTable<NumberRow>;
</script>

<!-- TODO NTS: Work on replicating error where sorting in pagination table causes infinite loop -->

<main>
    <h1>Svelte Top Table</h1>

    <div class="example">
        <h2>Basic Table Example From Static</h2>
        <div class="scroll">
            <Table data={languages} tableRow={ProgrammingLanguageRow} rowDisabled={_ => true} />
        </div>
    </div>
    <div class="example">
        <h2>PromiseTable for movie search</h2>
        <input placeholder="Movie Search" bind:value={movieSearch} />
        <div class="scroll">
            <Table
                data={() => searchMovies(movieSearch)}
                tableRow={MovieRow}
                on:click={(event) => {
                    window.location.href = event.detail.row.imdb_url;
                }}
            />
        </div>
    </div>

    <div class="example">
        <h2>Advanced Pagination Table</h2>

        <div class="scroll">
            <PaginationTable
                bind:this={pageTable}
                data={numberData}
                tableRow={NumberRow}
                bind:search
            />
        </div>
        <div class="scroll">
            {#if search !== undefined}
                <FilterSelector
                    bind:filter={search.filter}
                    columnData={COLUMN_DATA}
                    on:change={pageTable?.change()}
                />
                <pre>{JSON.stringify(search.filter.encode())}</pre>
            {/if}
        </div>
    </div>
</main>

<style lang="scss">
    main {
        width: 60vw;
        margin-inline: auto;
        overflow: hidden;

        .scroll {
            margin-block: 1em;
            overflow: scroll;
            max-width: 100%;
            resize: both;
        }
    }
</style>
