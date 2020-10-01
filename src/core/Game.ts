import { CoinPool, Coin } from './Coin';
import { CanvasRenderer } from "./CanvasRenderer";
import { canvasWidth, canvasHeight } from './canvasConfig';

export class Game {
    public coinPool: CoinPool;
    private renderer: CanvasRenderer;
    private timer: number | null;
    private render: (img: ImageBitmap) => void;
    private onEnd: (data: any) => void;
    private onScore: (score: number) => void;
    private status: 'running' | 'finish' = 'finish';

    constructor(config: {
        render: (img: ImageBitmap) => void;
        onEnd: (data: any) => void;
        onScore: (score: number) => void;
    }) {
        this.render = config.render;
        this.onEnd = config.onEnd;
        this.onScore = config.onScore;
        this.coinPool = new CoinPool(this.onScore);
        this.renderer = new CanvasRenderer(this);

        this.timeoutHandler = this.timeoutHandler.bind(this);
        this.timer = setTimeout(this.timeoutHandler, 0);
    }

    start() {
        if (this.coinPool.coins.length === 0) {
            this.coinPool.reset();
            this.status = 'running';
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

        this.checkTheEnd();
    }

    filterCoinPool(callback: (coin: Coin) => void) {
        this.coinPool.coins = this.coinPool.coins.filter(coin => {
            let state = coin.state();
            callback(state);
            return state.isAlive;
        });
    }

    checkTheEnd() {
        if (this.coinPool.coins.length === 0 && this.status === 'running') {
            this.status = 'finish';
            this.onEnd(this.coinPool.score);
        }
    }

    private ensureTimerIsRuning() {
        if (!this.timer) {
            this.timer = setTimeout(this.timeoutHandler, 0);
        }
    }
}
