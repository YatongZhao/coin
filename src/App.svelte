<script lang="ts">
    import { onMount } from 'svelte';
    import { GameCanvas } from './core/GameCanvas';
    let canvas: HTMLCanvasElement;
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
            }
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
    <canvas bind:this={canvas}/>
    <button on:click={handleStart} class="start-btn">start</button>
    <div class="card">
        <div>得分：{score}</div>
        <div>
            {#if isGameRunning}
                running
            {:else}
                end
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    // background-image: url(http://img-arch.pconline.com.cn/images/upload/upc/tx/photoblog/1410/09/c7/39457120_39457120_1412867995656.jpg);
    background-image: url(https://xiangshu.guyuanmiye.com/forum/Day_191112/64_728913_c9110794a611066.jpg);
    background-size: 200%;
    canvas {
        margin: 0 auto;
        box-shadow: 3px 4px 7px rgba(0, 0, 0, .3);
        z-index: 10;
    }
    .start-btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10px;
        z-index: 100;
    }
    .card {
        position: absolute;
        left: 0;
        top: 0;
    }
}
</style>
