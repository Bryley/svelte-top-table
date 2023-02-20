<script lang="ts" context="module">
    import { writable } from "svelte/store";

    function getNodeId(n: HTMLElement | null): string {
        if (n == null) return "";
        const name = `${n.nodeName}#${n.id}.${[...n.classList].join(".")}`;
        return `${getNodeId(n.parentElement)}>${name}`;
    }

    export const selectedModal = writable<string | null>(null);
</script>

<script lang="ts">
    let span: HTMLSpanElement;

    $: modalKey = getNodeId(span);

    export function showModal() {
        $selectedModal = modalKey;
    }
</script>

<span bind:this={span} />
{#if $selectedModal === modalKey}
    <div
        on:keypress={() => {}}
        on:click={() => ($selectedModal = null)}
        class="top-table--modal"
    >
        <div on:keypress={() => {}} on:click|stopPropagation={() => {}}>
            <div>
                <h2>Filter</h2>
                <button on:click={() => ($selectedModal = null)}>&times;</button
                >
            </div>
            <div>TODO NTS: Finish this</div>
            <button>Apply</button>
        </div>
    </div>
{/if}

<style lang="scss">
    .top-table--modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100;
        background: #00000038;
        display: flex;
        justify-content: center;
        align-items: center;

        > div {
            width: 50vw;
            max-height: 80vh;
            background: white;
            padding: 3em;
            border-radius: 10px;
            flex-direction: column;

            > div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                button {
                    font-size: 3em;
                    $size: 50px;
                    width: $size;
                    height: $size;
                    border-radius: 50%;
                }
            }

            h2 {
                margin: 0;
                font-size: 2.5em;
            }

            button {
                border: none;
                background: none;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                font-size: 2em;
                padding: 0.6em;
                border-radius: 10px;

                &:hover {
                    background: var(--top-table--button-bg-hover);
                    color: var(--top-table--button-fg-hover);
                }
            }
        }
    }
</style>
