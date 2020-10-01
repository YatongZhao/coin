<script lang="ts">
    import { onMount } from 'svelte';
    import { CoinCanvas } from './core/CoinCanvas';
    let canvas: HTMLCanvasElement;
    let coinCanvas: CoinCanvas;
    let isGameRunning = false;

    onMount(() => {
        coinCanvas = new CoinCanvas(canvas, {
            onEnd() {
                isGameRunning = false;
            }
        });
    });

    function handleStart() {
        if (coinCanvas) {
            coinCanvas.start();
            isGameRunning = true;
        }
    }

</script>

<canvas bind:this={canvas}/>
<div>
    {#if isGameRunning}
        running
    {:else}
        end
    {/if}
</div>
<button on:click={handleStart}>start</button>

<style lang="scss">

</style>
