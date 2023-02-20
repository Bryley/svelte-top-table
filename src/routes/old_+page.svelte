<script lang="ts">
    import Table from "$lib/Table.svelte";
    import { examplePeople } from "./example-data/people";
    import { languages } from "./example-data/programming";
    import MovieRow from "./MovieRow.svelte";
    import PersonRow from "./PersonRow.svelte";
    import ProgrammingLanguageRow from "./ProgrammingLanguageRow.svelte";
    import TableColorSelector from "./TableColorSelector.svelte";
    import type { Person } from "./types";
    import { searchMovies } from "./utils";

    let showHighlighted: boolean;
    let showDisabled: boolean;

    let movieSearch: string;
</script>

<main>
    <TableColorSelector />
    <h1>Welcome to Top Table</h1>
    <h3>Basic example with preloaded data</h3>
    <Table
        data={examplePeople}
        tableRow={PersonRow}
        rowDisabled={showDisabled ? (row) => row.name == "Bob" : () => false}
        rowHighlighted={showHighlighted ? (row) => row.name == "Steve" : () => false}
    />
    <div class="controls">
        <label>
            <input type="checkbox" bind:checked={showDisabled} />
            Show Disabled Row
        </label>
        <label>
            <input type="checkbox" bind:checked={showHighlighted} />
            Show Highlight Row
        </label>
    </div>
    <h3>Putting tables in divs</h3>
    <div class="row">
        <div>
            <Table
                data={examplePeople}
                tableRow={PersonRow}
                rowDisabled={(row) => row.age == 7}
                rowHighlighted={(row) => row.age > 100}
            />
        </div>
        <div>
            <Table
                data={examplePeople}
                tableRow={PersonRow}
                disableClick={() => true}
            />
        </div>
    </div>


    <h3>Group Data</h3>
    <Table
        data={languages}
        tableRow={ProgrammingLanguageRow}
    />


    <h3>Basic Example with loaded data</h3>
    <input bind:value={movieSearch} placeholder="Search for Movie" />
    <Table
        data={() => searchMovies(movieSearch)}
        tableRow={MovieRow}
        smallTable={true}
        on:click={(event) => {
            window.location.href = event.detail.row.imdb_url;
        }}
    />
</main>

<style lang="scss">
    :global(body) {
        background: var(--body-bg);
    }
    main {
        margin: 2vh 20vw;

        .row {
            display: flex;
            width: 100%;

            > * {
                width: 100%;
                margin-inline: 5em;
            }
        }
    }
</style>
