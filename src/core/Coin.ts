import { canvasHeight, canvasWidth, coinR } from './canvasConfig';

export class CoinPool {
    public coins: Array<Coin> = [];
    public bothTime: number = performance.now();
    public score: number = 0;

    constructor(private onScore: (score: number) => void) {}

    tryClick(point: [number, number]) {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            let isClicked = this.coins[i].tryClick(point);
            if (isClicked) {
                break;
            }
        }
    }

    createCoin(x: number, y: number, lifeLong: number) {
        let randomK = Math.random() * 100;
        // 80, 10, 6, 3, 1
        let now = performance.now();
        let dis = (now - this.bothTime) / 1000;

        if (randomK < 80 - dis) {
            new BaseCoin(x, y, lifeLong, this);
        } else if (randomK < 89 - dis) {
            new GreenCoin(x, y, lifeLong, this);
        } else if (randomK < 94 - dis) {
            new BlackCoin(x, y, lifeLong, this);
        } else if (randomK > 99) {
            new OrangeCoin(x, y, lifeLong, this);
        } else if (randomK > 98) {
            new BugCoin(x, y, lifeLong, this);
        } else {
            new RedCoin(x, y, lifeLong, this);
        }

        this.score++;
        this?.onScore(this.score);
    }

    reset() {
        this.score = 0;
        this.bothTime = performance.now();
    }
}

export class Coin {
    public color: string = 'yellow';
    public fontColor: string = 'black';
    public icon: string = '$';
    public bothTime: number = performance.now();
    public isAlive: boolean = true;
    public livePercent: number = 0;

    constructor(
        public x: number,
        public y: number,
        public lifeLong: number,
        public __pool__: CoinPool
    ) {
        this.lifeLong = lifeLong * (1 / ((this.bothTime - __pool__.bothTime) / 1000 + 1) + .3);
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

export class OrangeCoin extends BaseCoin {
    constructor(
        x: number, y: number, lifeLong: number, coinPool: CoinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'orange';
        this.fontColor = 'black';
        this.lifeLong = 5000;
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

export class BlackCoin extends BaseCoin {
    constructor(
        x: number, y: number, lifeLong: number, coinPool: CoinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'black';
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

        this.__pool__.createCoin(
            canvasWidth / 2,
            canvasHeight - coinR,
            5000
        );

        return true;
    }
}
export class RedCoin extends BaseCoin {
    constructor(
        x: number, y: number, lifeLong: number, coinPool: CoinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'red';
        this.fontColor = 'white';
    }

    tryClick(point: [number, number]) {
        if (!this.isClicked(point)) {
            return false;
        }

        for (let i = 0; i < 20; i++) {
            this.__pool__.createCoin(
                this.x,
                this.y,
                5000
            );
            this.isAlive = false;
        }

        return true;
    }
}

export class BugCoin extends BaseCoin {
    constructor(
        x: number, y: number, lifeLong: number, coinPool: CoinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'purple';
        this.fontColor = 'white';
        this.icon = '😢';
    }

    tryClick(point: [number, number]) {
        if (!this.isClicked(point)) {
            return false;
        }

        this.__pool__.createCoin(
            this.x,
            this.y,
            5000
        );

        this.__pool__.score -= 2;

        return true;
    }
}