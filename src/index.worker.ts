import { canvasWidth, canvasHeight, coinR } from './canvasConfig';
import { BaseCoin, CoinPool } from './Coin';

const ctx: Worker = self as any;

const offscreen = new OffscreenCanvas(canvasWidth, canvasHeight);
const offscreenCtx = offscreen.getContext('2d');

const drawCoin = (x, y, color, fontColor = 'black') => {
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(x + coinR, y);
    offscreenCtx.arc(x, y, coinR, 0, 2 * Math.PI);
    offscreenCtx.fillStyle = color;
    offscreenCtx.shadowOffsetX = 3;
    offscreenCtx.shadowOffsetY = 4;
    offscreenCtx.shadowBlur = 5;
    offscreenCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    offscreenCtx.fill();
    offscreenCtx.shadowOffsetX = 0;
    offscreenCtx.shadowOffsetY = 0;
    offscreenCtx.shadowBlur = 0;
    offscreenCtx.fillStyle = fontColor;
    offscreenCtx.font = "bold 22px '微软雅黑'";
    offscreenCtx.fillText('$', x, y + 8);
    offscreenCtx.textAlign = 'center';
    offscreenCtx.closePath();
}

let coinPool = new CoinPool();

const strokeCoin = () => {
    coinPool.coins = coinPool.coins.filter(coin => {
        let state = coin.state();
        if (state.isAlive) {
            drawCoin(state.x, state.y, state.color, state.fontColor);
        }

        return state.isAlive;
    });
}

const stroke = () => {
    offscreenCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    strokeCoin();

    const img = offscreen.transferToImageBitmap();

    ctx.postMessage({ type: 'drawPoint', img });
}

let timer = null;

let mouseX = 0;
let mouseY = 0;

const timeoutHandler = () => {
    stroke();
    clearTimeout(timer);
    timer = null;

    if (coinPool.coins.length !== 0) {
        timer = setTimeout(timeoutHandler, 0);
    }
}

ctx.addEventListener('message', e => {
    if (e.data.msg === 'drawPoint') {
        if (!(e.data.mouseX === mouseX && e.data.mouseY === mouseY)) {
            mouseX = e.data.mouseX;
            mouseY = e.data.mouseY;

            if (!timer) {
                timer = setTimeout(timeoutHandler, 0);
            }
        }
    } else if (e.data.msg === 'add$') {
        new BaseCoin(e.data.$[0], e.data.$[1], e.data.$[2], coinPool);

        if (!timer) {
            timer = setTimeout(timeoutHandler, 0);
        }
    } else if (e.data.msg === 'click$') {
        coinPool.tryClick(e.data.position);
    }
});

timer = setTimeout(timeoutHandler, 0);

export default ctx as any;
