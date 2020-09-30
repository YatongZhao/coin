import { canvasHeight, canvasWidth, coinR } from './canvasConfig';

export class CoinPool {
    public coins: Array<Coin>;
    public bothTime: number;
    constructor() {
        this.coins = [];
        this.bothTime = performance.now();
    }

    tryClick(point: [number, number]) {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            let isClicked = this.coins[i].tryClick(point);
            if (isClicked) {
                break;
            }
        }
    }

    createCoin(x: number, y: number, lifeLong: number) {
        let randomK = Math.random();

        if (randomK < .8) {
            new BaseCoin(x, y, lifeLong, this);
        } else {
            new GreenCoin(x, y, lifeLong, this);
        }
    }
}

export class Coin {
    public color: string;
    public fontColor: string;
    public bothTime: number;
    public isAlive: boolean;
    public livePercent: number;

    constructor(
        public x: number,
        public y: number,
        public lifeLong: number,
        public __pool__: CoinPool
    ) {
        this.color = 'yellow';
        this.fontColor = 'black';
        this.bothTime = performance.now();
        this.livePercent = 0;
        this.lifeLong = lifeLong * (1 / ((this.bothTime - __pool__.bothTime) * 10 + 1) + .3);
        this.isAlive = true;
        __pool__.coins.push(this);
    }

    state() {
        let liveTime = performance.now() - this.bothTime;
        this.livePercent = liveTime / this.lifeLong;
        if (liveTime > this.lifeLong) {
            this.isAlive = false;
        } else {
            this.x = this.updateX(liveTime);
            this.y = this.updateY(liveTime);
        }
        return this;
    }

    updateX(liveTime: number) {
        return this.x + liveTime / 1000;
    }

    updateY(liveTime: number) {
        return this.y + liveTime / 1000;
    }

    isClicked(point: [number, number]) {
        if (
            (point[0] - this.x) ** 2 +
            (point[1] - this.y) ** 2 <=
            coinR ** 2
        ) {
            return true;
        } else {
            return false;
        }
    }

    tryClick(point: [number, number]) {
        if (!this.isClicked(point)) {
            return false;
        }

        this.__pool__.createCoin(
            canvasWidth / 2,
            canvasHeight - coinR,
            5000
        );

        return true;
    }
}

export class BaseCoin extends Coin {
    private target: [number, number];
    private originX: number;
    private originY: number;

    constructor(x: number, y: number, lifeLong: number, coinPool: CoinPool) {
        super(x, y, lifeLong, coinPool);
        this.target = [
            2 * coinR + Math.random() * (canvasWidth - 4 * coinR),
            2 * coinR + Math.random() * (canvasHeight - 4 * coinR)
        ];

        this.originX = x;
        this.originY = y;
    }

    updateX(liveTime: number) {
        let distance = this.target[0] - this.x;

        let p1 = distance / this.lifeLong ** 2;

        return liveTime ** 2 * p1 + this.x;
    }

    updateY(liveTime: number) {
        let distance = this.target[1] - this.y;

        let p1 = distance / this.lifeLong ** 2;

        return liveTime ** 2 * p1 + this.y;
    }
}

export class GreenCoin extends BaseCoin {
    constructor(
        x: number, y: number, lifeLong: number, coinPool: CoinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'green';
        this.fontColor = 'white';
    }

    tryClick(point: [number, number]) {
        if (!this.isClicked(point)) {
            return false;
        }

        this.__pool__.createCoin(
            canvasWidth / 2,
            canvasHeight - coinR,
            5000
        );

        this.__pool__.createCoin(
            canvasWidth / 2,
            canvasHeight - coinR,
            5000
        );

        return true;
    }
}
