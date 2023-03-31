<script lang="ts">
    import { TableColumn } from "$lib";
    import TableGroup from "$lib/table/TableGroup.svelte";
    import type { Number } from "../example-data/number";

    export let row: Number;
</script>

<TableColumn id="number" title="Number" sortable>
    {row.number}
</TableColumn>
<TableColumn id="isEven" title="Is Even" sortable>
    {row.isEven}
</TableColumn>
<TableColumn id="isNegative" title="Is Negative" sortable>
    {row.isNegative}
</TableColumn>
<TableColumn id="half" title="Half" sortable>
    {row.half}
</TableColumn>
<TableGroup name="Example">
    <TableColumn id="fizz" title="FizzBuzz?" sortable>
        {row.fizz}
    </TableColumn>
    <TableColumn id="text" title="Text" sortable>
        {row.text}
    </TableColumn>
</TableGroup>
