import { CoinPool } from './Coin';
import { CanvasRenderer } from "./CanvasRenderer";
import { canvasWidth, canvasHeight } from './canvasConfig';

export class Game {
    public coinPool: CoinPool;
    private renderer: CanvasRenderer;
    private timer: number | null;
    private render: (ImageBitmap) => void;

    constructor({
        render
    }: {
        render: (ImageBitmap) => void;
    }) {
        this.render = render;
        this.coinPool = new CoinPool();
        this.renderer = new CanvasRenderer(this);

        this.timeoutHandler = this.timeoutHandler.bind(this);
        this.timer = setTimeout(this.timeoutHandler, 0);
    }

    start() {
        if (this.coinPool.coins.length === 0) {
            this.coinPool.createCoin(canvasWidth/ 2, canvasHeight / 2, 7000);

            this.ensureTimerIsRuning();

            return true;
        }

        return false;
    }

    add$(x: number, y: number, lifeLong: number) {
        this.coinPool.createCoin(x, y, lifeLong);

        this.ensureTimerIsRuning();
    }

    click$(e: [number, number]) {
        this.coinPool.tryClick(e);
    }

    private timeoutHandler() {
        const img = this.renderer.render();
        this.render(img);
        clearTimeout(this.timer);

        if (this.coinPool.coins.length !== 0) {
            this.timer = setTimeout(this.timeoutHandler, 0);
        } else {
            this.timer = null;
        }
    }

    private ensureTimerIsRuning() {
        if (!this.timer) {
            this.timer = setTimeout(this.timeoutHandler, 0);
        }
    }
}
