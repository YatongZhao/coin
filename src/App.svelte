<script lang="ts">
    import { onMount } from 'svelte';
    import { CoinCanvas } from './core/CoinCanvas';
    let canvas: HTMLCanvasElement;
    let coinCanvas: CoinCanvas;

    onMount(() => {
        coinCanvas = new CoinCanvas(canvas);
    });

    function handleStart() {
        if (coinCanvas) {
            coinCanvas.start();
        }
    }

</script>

<canvas bind:this={canvas}/>
<button on:click={handleStart}>start</button>

<style lang="scss">

</style>
