<script lang="ts">
    import {TableColumn} from "$lib";
    import type { Movie } from "./types";

    export let row: Movie;
</script>

<TableColumn title="Poster"
    ><img alt="poster" src={row.img_poster} /></TableColumn
>
<TableColumn title="Title">{row.title}</TableColumn>
<TableColumn title="Year">{row.year}</TableColumn>
<TableColumn title="Actors">{row.actors.split(",").length}</TableColumn>

<style lang="scss">
    img {
        width: 2em;
    }
</style>
