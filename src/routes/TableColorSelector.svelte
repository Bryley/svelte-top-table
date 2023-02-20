<script lang="ts" context="module">
    export function getAllCSSVariableNames(
        styleSheets = document.styleSheets
    ): string[] {
        var cssVars = [];
        // loop each stylesheet
        for (var i = 0; i < styleSheets.length; i++) {
            // loop stylesheet's cssRules
            try {
                // try/catch used because 'hasOwnProperty' doesn't work
                for (var j = 0; j < styleSheets[i].cssRules.length; j++) {
                    try {
                        // loop stylesheet's cssRules' style (property names)
                        for (
                            var k = 0;
                            k < styleSheets[i].cssRules[j].style.length;
                            k++
                        ) {
                            let name = styleSheets[i].cssRules[j].style[k];
                            // test name for css variable signiture and uniqueness
                            if (
                                (name === "--body-bg" ||
                                    name.startsWith("--top-table")) &&
                                cssVars.indexOf(name) == -1
                            ) {
                                cssVars.push(name);
                            }
                        }
                    } catch (error) {}
                }
            } catch (error) {}
        }
        return cssVars;
    }
</script>

<script lang="ts">
    import { browser } from "$app/environment";

    const variables = browser ? getAllCSSVariableNames() : [];
    let selectedColors: { [k: string]: any };
    let ORIGINAL: typeof selectedColors;

    if (browser) {
        const bodyStyle = getComputedStyle(document.body);

        selectedColors = Object.fromEntries(
            variables.map((variable) => {
                return [variable, bodyStyle.getPropertyValue(variable)];
            })
        );
        ORIGINAL = { ...selectedColors };
    }

    function generateCSS(selectedColors: typeof ORIGINAL): string {
        if (selectedColors === undefined) {
            return "";
        }
        console.log(selectedColors);
        return (
            Object.entries(selectedColors)
                .map((item) => {
                    return `${item[0]}: ${item[1]}`;
                })
                .join(";\n") + ";"
        );
    }
    $: css = generateCSS(selectedColors);

    function updateProperties(selectedColors: typeof ORIGINAL) {
        if (selectedColors === undefined) {
            return;
        }
        Object.entries(selectedColors).forEach((item) => {
            document.documentElement.style.setProperty(item[0], item[1]);
        });
    }
    $: updateProperties(selectedColors);
</script>

<div class="color-selector">
    {#each variables as variable}
        <label>
            {variable}
            <input type="color" bind:value={selectedColors[variable]} />
        </label>
    {/each}
    <button
        on:click={() => {
            selectedColors = { ...ORIGINAL };
        }}>Set back to default</button
    >
    <textarea bind:value={css} readonly />
</div>

<style lang="scss">
    .color-selector {
        position: fixed;
        left: 5px;
        top: 5px;
        width: 15vw;
        display: flex;
        flex-direction: column;
        background: #f2f2f2;
        border-radius: 1em;
        padding: 2em;

        label {
            display: flex;
            justify-content: space-between;
        }

        textarea {
            height: 15em;
            resize: none;
        }
    }
</style>
