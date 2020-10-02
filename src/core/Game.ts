import type { Coin } from './Coin';
import { CoinPool } from './CoinPool';
import type { CanvasRenderer } from "./CanvasRenderer";
import type { Hero } from './Hero';

export class Game {
    public coinPool: CoinPool;
    public player1: null | Hero;

    public renderer: CanvasRenderer;
    private timer: number | null;
    private render: (img: ImageBitmap, x: number, y: number) => void;
    private onEnd: (data: any) => void;
    private onScore: (score: number) => void;
    public status: 'running' | 'finish' = 'finish';

    constructor(config: {
        render: (img: ImageBitmap, x: number, y: number) => void;
        onEnd: (data: any) => void;
        onScore: (score: number) => void;
    }) {
        this.render = config.render;
        this.onEnd = config.onEnd;
        this.onScore = config.onScore;
        this.coinPool = new CoinPool(this.onScore, this);

        this.timeoutHandler = this.timeoutHandler.bind(this);
        this.timer = setTimeout(this.timeoutHandler, 0);
    }

    initRenderer(renderer: CanvasRenderer) {
        this.renderer = renderer;
    }

    start() {
        if (this.coinPool.coins.length === 0) {
            this.coinPool.reset();
            this.status = 'running';
            this.coinPool.createCoin(this.renderer.canvasWidth/ 2, this.renderer.canvasHeight / 2, 7000);

            if (this.player1) {
                this.player1.reset();
            }

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
        if (!this.renderer) {
            return;
        }
        const img = this.renderer.render();
        if (this.player1) {
            this.render(img, this.player1.x, this.player1.y);
        } else {
            this.render(img, this.renderer.canvasWidth / 2, this.renderer.canvasHeight / 2);
        }
        clearTimeout(this.timer);

        if (this.coinPool.coins.length !== 0) {
            this.timer = setTimeout(this.timeoutHandler, 0);
        } else {
            this.timer = null;
        }

        this.checkTheEnd();
    }

    filterCoinPool(callback: (coin: Coin) => void) {
        if (this.player1) {
            this.coinPool.tryEat(this.player1);
        }
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

    addPlayer1(hero: Hero) {
        this.player1 = hero;
        hero.contactGame(this);
    }

    private ensureTimerIsRuning() {
        if (!this.timer) {
            this.timer = setTimeout(this.timeoutHandler, 0);
        }
    }
}
