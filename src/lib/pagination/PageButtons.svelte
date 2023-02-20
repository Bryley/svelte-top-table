<script lang="ts" context="module">
    import DoublyLinkedList from "./linked-list";
    import { createEventDispatcher } from "svelte";
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();

    /** Asumming this is an odd number */
    const BUBBLE_COUNT = 9;

    /** The page to view (index starts at 0 but displayed as 1) */
    export let page: number;
    /** Up to but not including (undefined means not known yet (loading) */
    export let pageMax: number | undefined = undefined;

    function selectPage(selectedPage: number) {
        page = selectedPage;
        dispatch("pagechange", selectedPage);
    }

    /**
     * Creates an array of numbers and / or null values to say what to display,
     * numbers are displayed as is and null values should be replaced with '...'
     *
     * # Implementation Explanation
     *
     * This function uses an algorithm that populates the pages in an structured
     * way.
     * It starts with the page number fills to either side starting with a prev
     * page then a next page like so starting at 0:
     *
     *                  (6) (4) (2) (0) [page] (1) (3) (5) (7)
     *
     * This is done by using a function that converts the index 0,1,2,3... to an
     * offset -1,1,-2,2,-3,3...
     *
     *               ( 6) ( 4) ( 2) ( 0) [page] (1) (3) (5) (7)
     *               (-4) (-3) (-2) (-1) [page] (1) (2) (3) (4)
     *
     * This makes getting the page for each spot easy. The page at the given
     * spot is calculated and if it is out of bounds then a counter called
     * 'overflowOffset' is added to. This overflowOffset is added to the original
     * index before doing any calcualtions as to skip over any out of bound pages
     */
    function getBubbleValues(
        currentPage: number,
        pageMax: number | undefined
    ): Iterable<number | null> {
        // If the number of pages is small then display all options
        if ((pageMax ?? 1000000) <= BUBBLE_COUNT) {
            return Array.from(Array(pageMax).keys());
        }

        const bubbles = new DoublyLinkedList<number | null>(currentPage);

        // 'offset' maps x=0,1,2,3,4... to o=-1,1,-2,2,-3,3,-4,4...
        const offset = (x: number) =>
            ((x - (x % 2) + 2) * (2 * (x % 2) - 1)) / 2;
        const populateFunction = [
            (v: number) => bubbles.prepend(v),
            (v: number) => bubbles.append(v),
        ];
        let overflowOffset = 0; // Used to skip at the ends
        for (let i = 0; i < BUBBLE_COUNT - 1; i++) {
            let page = currentPage + offset(i + overflowOffset);

            if (page < 0 || page >= (pageMax ?? 1000000)) {
                page = currentPage + offset(i + ++overflowOffset);
            }

            populateFunction[(i + overflowOffset) % 2](page);
        }

        // [0] = needs just start ellipse, [1] = needs just end ellipse
        // If both are false then both ends need an ellipse
        const endFlags = [
            overflowOffset > 0 && currentPage > (pageMax ?? 1000000) / 2,
            overflowOffset > 0 && currentPage < (pageMax ?? 1000000) / 2,
        ];

        // Add jumps to begining and last pages if required
        if (endFlags[0] || endFlags.every((v) => v === false)) {
            bubbles.set(0, 0);
            bubbles.set(1, null);
        }
        if (endFlags[1] || endFlags.every((v) => v === false)) {
            bubbles.set(bubbles.length - 1, pageMax === undefined ? null : pageMax - 1);
            bubbles.set(bubbles.length - 2, null);
        }

        return bubbles;
    }
    $: bubbleValues = getBubbleValues(page, pageMax);
</script>

<div class="top-table--page-btns">
    {#if page > 0}
        <button class="top-table--arrow" on:click={() => selectPage(page - 1)}>
            <slot name="nav-before">&lt;</slot>
        </button>
    {/if}
    {#each [...bubbleValues] as bubble}
        {#if bubble === null}
            <span class="top-table--dots">...</span>
        {:else}
            <button
                class="top-table--bubble"
                class:active={bubble === page}
                on:click={() => selectPage(bubble ?? 0)}
            >
                {bubble + 1}
            </button>
        {/if}
    {/each}
    {#if page < (pageMax ?? 1000000) - 1}
        <button class="top-table--arrow" on:click={() => selectPage(page + 1)}>
            <slot name="nav-after">&gt;</slot>
        </button>
    {/if}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        align-items: center;

        .top-table--dots {
            margin-inline: 10px;
        }

        .top-table--bubble,
        .top-table--arrow {
            cursor: pointer;
            border: none;
            border-radius: 1000px;
            font-size: 1em;
            background: var(--top-table--button-bg);
            color: var(--top-table--button-fg);
            margin-inline: 5px;

            &.active,
            &:hover {
                background: var(--top-table--button-bg-hover);
                color: var(--top-table--button-fg-hover);
            }
        }

        /*
        .top-table--arrow {
            font-size: 1.5em;
            background: none;
            border-radius: 50%;
            aspect-ratio: 1;
            box-shadow: 0px 0px 2px #78787847;
        }
        */
    }
</style>
