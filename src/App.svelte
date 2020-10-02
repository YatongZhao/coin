<script lang="ts">
    import { onMount } from 'svelte';
    import { GameCanvas } from './core/GameCanvas';
    let canvas: HTMLCanvasElement;
    let mapCanvas: HTMLCanvasElement;
    let gameCanvas: GameCanvas;
    let isGameRunning = false;
    let score = 0;

    let bgPositionX = 0;
    let bgPositionY = 0;

    onMount(() => {
        gameCanvas = new GameCanvas(canvas, {
            onEnd(n) {
                isGameRunning = false;
                score = n;
            },
            onScore(_score) {
                score = _score;
            },
            onRender(x, y) {
                bgPositionX = -x;
                bgPositionY = -y;
            },
            map: mapCanvas
        });
    });

    function handleStart() {
        if (GameCanvas) {
            score = 0;
            gameCanvas.start();
            isGameRunning = true;
        }
    }

</script>

<div class="container" style={`background-position: ${bgPositionX * 0.5}px ${bgPositionY * 0.5}px;`}>
    <canvas class="main" bind:this={canvas}/>
    <canvas class="map" bind:this={mapCanvas}/>
    {#if !isGameRunning}
    <button on:click={handleStart} class="start-btn">start</button>
    {/if}
    <div class="card">
        <div>得分：{score}</div>
        <!-- <div>
            {#if isGameRunning}
                running
            {:else}
                end
            {/if}
        </div> -->
    </div>
</div>

<style lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-image: url(https://xiangshu.guyuanmiye.com/forum/Day_191112/64_728913_c9110794a611066.jpg);
    background-size: 1800px;
    canvas.main {
        margin: 0 auto;
        box-shadow: 3px 4px 7px rgba(0, 0, 0, .3);
        z-index: 10;
    }
    .map {
        position: absolute;
        width: 160px;
        height: 120px;
        box-shadow: 3px 4px 7px rgba(0, 0, 0, .3);
        right: 10px;
        top: 10px;
        border-radius: 5px;
    }
    .start-btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10px;
        z-index: 100;
        border-radius: 3px;
        border: none;
        width: 100px;
        height: 20px;
    }
    .card {
        position: absolute;
        left: 0;
        top: 0;
        padding: 5px 10px;
        color: black;
        text-shadow: 3px 4px 7px rgba(0, 0, 0, .3);
    }
}
</style>
