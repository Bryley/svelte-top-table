<script lang="ts">
    import {TableColumn} from "$lib";
    import type { Person } from "./types";

    export let row: Person;

</script>

<TableColumn title={"Name"}>{row.name}</TableColumn>
<TableColumn title={"Nickname"}>{row.nickname}</TableColumn>
<TableColumn title={"Age"}>{row.age}</TableColumn>
<TableColumn title={"Favourite Color"}>
    <div class="example-color" style="background: {row.favColor};" />
</TableColumn>
<TableColumn title={"Description"}>{row.description}</TableColumn>

<style lang="scss">
    .example-color {
        width: 50px;
        height: 10px;
        border-radius: 100em;
        border: solid #e6e6e6 3px;
    }
</style>
