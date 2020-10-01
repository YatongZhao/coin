<script lang="ts">
    import { onMount } from 'svelte';
    import { CoinCanvas } from './core/CoinCanvas';
    let canvas: HTMLCanvasElement;
    let coinCanvas: CoinCanvas;
    let isGameRunning = false;
    let score = 0;

    onMount(() => {
        coinCanvas = new CoinCanvas(canvas, {
            onEnd(n) {
                isGameRunning = false;
                score = n;
            },
            onScore(_score) {
                score = _score;
            }
        });
    });

    function handleStart() {
        if (coinCanvas) {
            score = 0;
            coinCanvas.start();
            isGameRunning = true;
        }
    }

</script>

<div class="container">
    <canvas bind:this={canvas}/>
    <button on:click={handleStart} class="start-btn">start</button>
</div>
<div>得分：{score}</div>
<div>
    {#if isGameRunning}
        running
    {:else}
        end
    {/if}
</div>

<style lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    canvas {
        margin: 0 auto;
        box-shadow: 3px 4px 7px rgba(0, 0, 0, .3);
    }
    .start-btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -10px;
    }
}
</style>
