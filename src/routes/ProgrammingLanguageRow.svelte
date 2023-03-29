<script lang="ts">
    import { TableGroup, TableColumn } from "$lib";
    import type { ProgrammingLanguage } from "./types";

    export let row: ProgrammingLanguage;
</script>

<TableGroup name="Main Data">
    <TableColumn id="name" title="Name" sticky={true} sortable={true}>
        {row.name}
    </TableColumn>

    <TableColumn id="version" title="Version" sticky={true} sortable={true}>
        {row.version}
    </TableColumn>

    <TableColumn id="releaseDate" title="Release Date" sortable={true}>
        {row.releaseDate}
    </TableColumn>

    <TableColumn id="popularity" title="Popularity" sortable={true}>
        {row.popularity}
    </TableColumn>
</TableGroup>

<TableGroup name="Additional Content">
    <TableColumn id="website" title="Website">
        {row.website}
    </TableColumn>

    <TableColumn id="creator" title="Creator" sortable={true}>
        {row.creator}
    </TableColumn>

    <TableColumn id="firstAppeared" title="First Appeared" sortable={true}>
        {row.firstAppeared}
    </TableColumn>
</TableGroup>

<TableColumn title="Logo">
    {row.logo}
</TableColumn>
