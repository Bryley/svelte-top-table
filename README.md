# Svelte-Top-Table

A svelte component library for creating advanced stylish tables.

Note that this library is still under development...

## Installation

```
npm install svelte-top-table
```

## Screenshots

TODO

## Usage

### `Table`
To create a basic table you will need to import and use the `<Table>` component from the main library.

Below are the props that you can pass into it:

| Property         | Type                            | Required | Default                                              | Description                                                                                                                                                                        |
|------------------|---------------------------------|----------|------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data`           | `Row[] \| () => Promise<Row[]>` | `true`   | -                                                    | Describes how the table will retrieve its data. Either directly passed in, or an async function is passed in.                                                                      |
| `tableRow`       | `SvelteComponent`               | `true`   | -                                                    | The svelte component that will render the rows.                                                                                                                                    |
| `fillSpace`      | `boolean`                       | `false`  | `false`                                              | If the table should fill its available space (Apply's `width: 100%` CSS rule if true)                                                                                              |
| `disableClick`   | `(row: Row) => boolean`         | `false`  | `_ => false` (All rows do have a click action on it) | A function that will return true if the given row cannot be clicked and false if it can be clicked                                                                                 |
| `rowDisabled`    | `(row: Row) => boolean`         | `false`  | `_ => false` (All rows are enabled by default)       | A function that will return true if the given row should be disabled and false if not                                                                                              |
| `rowHighlighted` | `(row: Row) => boolean`         | `false`  | `_ => false` (All rows are not highlighted)          | A function that will return true if the given row should be highlighed                                                                                                             |
| `errorComp`      | `SvelteComponent \| undefined`  | `false`  | `undefined`                                          | If the `data` prop is an async function and fails, then this component will be rendered instead of plain text. Note that the actual error will be passed into this prop as `error` |
| `errorCompProps` | `{ [key: string]: any }`        | `false`  | `{}`                                                 | Any additional properties to pass into the `errorComp`                                                                                                                             |
| `sortedColumn`   | `SortData \| null`              | `false`  | `null`                                               | A bindable field that stores what column the user want's to sort or null if no columns                                                                                             |

*Note* that `Row` is a generic type passed into the Component that should be an object that contains a string key (`{ [column: string]: any }`).

#### Example

The below example creates a table that displays "people's" information:

```svelte
<script>
    import { Table } from 'svelte-top-table';
    import PersonRow from './PersonRow.svelte';

    const examplePeople = [
        {
            name: "Bob",
            nickname: "Bobby",
            age: 46,
            favColor: "#45a",
            description: "Fantastic Guy",
        },
        {
            name: "Alice",
            nickname: "Al",
            age: 27,
            favColor: "#c50",
            description: "New member since 2005",
        },
        {
            name: "Steve",
            nickname: "Stevie",
            age: 18,
            favColor: "#f0b",
            description: "Can't stand rainy weather",
        },
        {
            name: "Brittany",
            nickname: "Briz",
            age: 33,
            favColor: "#19f",
            description: "Wizz with computers",
        },
    ];
</script>

<div>
    <Table
        data={examplePeople}
        tableRow={PeopleRow}
    />
    <!-- You can also put it in an async function incase your data is retrieved
    from someplace external -->
    <Table
        data={async () => examplePeople}
        tableRow={PeopleRow}
    />
</div>
```

```svelte
<!-- PeopleRow.svelte -->
<script>
    import {TableColumn} from 'svelte-top-table';

    export let row;
</script>

<TableColumn title="Name">{row.name}</TableColumn>
<TableColumn title="Nickname">{row.nickname}</TableColumn>
<TableColumn title="Age">{row.age}</TableColumn>
<TableColumn title="Favourite Color">
    <div class="example-color" style="background: {row.favColor};" />
</TableColumn>
<TableColumn title="Description">{row.description}</TableColumn>

<style>
    .example-color {
        width: 50px;
        height: 10px;
        border-radius: 100em;
        border: solid #e6e6e6 3px;
    }
</style>
```

### `TableColumn`

The `TableColumn` is used to define a column and is used within the component that is defined in the `tableRow` prop in either the `Table` or `PaginationTable`.
The actual content of the cell is defined in the default slot and is usually dependent on the `row`.

#### Props

| Property   | Type      | Required | Default             | Description                                                                                                                                    |
|------------|-----------|----------|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`    | `string`  | `false`  | `""`                | The displayed title within the header                                                                                                          |
| `id`       | `string`  | `false`  | Whatever `title` is | The unique id of the column. Note this must be unique and if sorting is enabled then it will use this as the key it sorts by                   |
| `sticky`   | `boolean` | `false`  | `false`             | If true, then the column will stay stuck to the edge when scrolling horisontally                                                               |
| `sortable` | `boolean` | `false`  | `false`             | If true then this column has the sorting functionality enabled. Note make sure that the `id` prop is set correctly so it knows what to sort by |

An example can be seen above with `PersonRow.svelte`.

### `TableGroup`

`TableGroup` is used to group columns together and allow users to collapse these groups of columns if they are taking up too much space.
The columns that are a part of the group are given as the default slot of the component.

#### Props

| Property | Type     | Required | Default | Description                               |
|----------|----------|----------|---------|-------------------------------------------|
| `name`   | `string` | `true`   | -       | The unique name for the group to collapse |

#### Example

```svelte
<!-- This component is referenced in the `tableRow` prop for the Table -->
...
<TableColumn id="popularity" title="Popularity" sortable={true}>
    {row.popularity}
</TableColumn>

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
...
```

### `PaginationTable`

TODO

### `FilterSelection`

TODO

### Colors

TODO

If you need more examples, have a look at the routes for some examples on how to use the tables these examples are also in Typescript.
