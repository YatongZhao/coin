import { canvasHeight, canvasWidth, coinR } from './canvasConfig';

export class CoinPool {
    constructor() {
        this.coins = [];
        this.bothTime = performance.now();
    }

    tryClick(point) {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            let isClicked = this.coins[i].tryClick(point);
            if (isClicked) {
                break;
            }
        }
    }

    createCoin(x, y, lifeLong) {
        let randomK = Math.random();

        if (randomK < .8) {
            new BaseCoin(x, y, lifeLong, this);
        } else {
            new GreenCoin(x, y, lifeLong, this);
        }
    }
}

export class Coin {
    constructor(
        x, y, lifeLong, coinPool
    ) {
        this.x = x;
        this.y = y;
        this.__pool__ = coinPool;
        this.color = 'yellow';
        this.fontColor = 'black';
        this.bothTime = performance.now();
        this.lifeLong = lifeLong * (1 / ((this.bothTime - this.__pool__.bothTime) * 10 + 1) + .8);
        this.isAlive = true;
        coinPool.coins.push(this);
    }

    state() {
        let liveTime = performance.now() - this.bothTime;
        if (liveTime > this.lifeLong) {
            this.isAlive = false;
        } else {
            this.x = this.updateX(liveTime);
            this.y = this.updateY(liveTime);
        }
        return this;
    }

    updateX(liveTime) {
        return this.x + liveTime / 1000;
    }

    updateY(liveTime) {
        return this.y + liveTime / 1000;
    }

    isClicked(point) {
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

    tryClick(point) {
        if (!this.isClicked(point)) {
            return false;
        }

        this.__pool__.createCoin(
            canvasWidth / 2,
            canvasHeight - coinR,
            2000
        );

        return true;
    }
}

export class BaseCoin extends Coin {
    constructor(
        x, y, lifeLong, coinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.target = [
            2 * coinR + Math.random() * (canvasWidth - 4 * coinR),
            2 * coinR + Math.random() * (canvasHeight - 4 * coinR)
        ];

        this.originX = x;
        this.originY = y;
    }

    updateX(liveTime) {
        let distance = this.target[0] - this.x;

        let p1 = distance / this.lifeLong ** 2;

        return liveTime ** 2 * p1 + this.x;
    }

    updateY(liveTime) {
        let distance = this.target[1] - this.y;

        let p1 = distance / this.lifeLong ** 2;

        return liveTime ** 2 * p1 + this.y;
    }
}

export class GreenCoin extends BaseCoin {
    constructor(
        x, y, lifeLong, coinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'green';
        this.fontColor = 'white';
    }

    tryClick(point) {
        if (!this.isClicked(point)) {
            return false;
        }

        this.__pool__.createCoin(
            canvasWidth / 2,
            canvasHeight - coinR,
            2000
        );

        this.__pool__.createCoin(
            canvasWidth / 2,
            canvasHeight - coinR,
            2000
        );

        return true;
    }
}
