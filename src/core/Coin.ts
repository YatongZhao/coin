import { coinR } from './canvasConfig';
import type { CoinPool } from './CoinPool';
import type { Hero } from './Hero';

export class Coin {
    public color: string = 'yellow';
    public fontColor: string = 'black';
    public icon: string = '$';
    public bothTime: number = performance.now();
    public isAlive: boolean = true;
    public livePercent: number = 0;
    public flyTime: number = 2500;
    public canvasWidth;
    public canvasHeight;

    constructor(
        public x: number,
        public y: number,
        public lifeLong: number,
        public __pool__: CoinPool
    ) {
        this.lifeLong = lifeLong * (1 / ((this.bothTime - __pool__.bothTime) / 2500 + 1));
        __pool__.coins.push(this);
        this.canvasWidth = __pool__.__game__.renderer.canvasWidth;
        this.canvasHeight = __pool__.__game__.renderer.canvasHeight;
    }

    state() {
        let liveTime = performance.now() - this.bothTime;

        if (liveTime > this.flyTime) {
            this.livePercent = (liveTime - this.flyTime) / this.lifeLong;
        } else {
            this.livePercent = 0;
        }
        if (liveTime > this.lifeLong + this.flyTime) {
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
            (coinR + 50) ** 2
        ) {
            return true;
        } else {
            return false;
        }
    }

    isEatedBy(hero: Hero) {
        if (
            (hero.x - this.x) ** 2 +
            (hero.y - this.y) ** 2 <=
            (coinR + hero.heroR) ** 2
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

        this.emitPower();

        return true;
    }

    tryToBeEated(hero: Hero) {
        if (!this.isEatedBy(hero)) {
            return false;
        }

        this.emitPower();
        this.isAlive = false;
        return true;
    }

    emitPower() {
        this.createCoinFromEdge();
    }

    createCoinFromCenter(n: number = 1) {

        for (let i = 0; i < n; i++) {
            this.__pool__.createCoin(
                this.canvasWidth / 2,
                this.canvasHeight - coinR,
                5000
            );
        }
    }

    createCoinFromEdge(n: number = 1) {

        for (let i = 0; i < n + 1; i++) {
            let R1 = Math.random();
            let R2 = Math.random();
            let x: number, y: number;
            if (R1 > 0.75) {
                x = 0;
                y = this.canvasHeight * R2;
            } else if (R1 > 0.5) {
                x = this.canvasWidth;
                y = this.canvasHeight * R2;
            } else if (R1 > 0.25) {
                x = this.canvasWidth * R2;
                y = 0;
            } else {
                x = this.canvasWidth * R2;
                y = this.canvasHeight;
            }

            this.__pool__.createCoin(x, y, 10000);
        }

        this.isAlive = false;
    }
}

export class BaseCoin extends Coin {
    public target: [number, number];
    public originX: number;
    public originY: number;

    constructor(x: number, y: number, lifeLong: number, coinPool: CoinPool) {
        super(x, y, lifeLong, coinPool);
        this.target = [
            2 * coinR + Math.random() * (this.canvasWidth - 4 * coinR),
            2 * coinR + Math.random() * (this.canvasHeight - 4 * coinR)
        ];
        this.originX = x;
        this.originY = y;
    }

    updateX(liveTime: number) {
        if (liveTime < this.flyTime) {
            let distance = this.target[0] - this.originX;
    
            return distance / this.flyTime * liveTime + this.originX;
        }

        return this.target[0];
    }

    updateY(liveTime: number) {
        if (liveTime < this.flyTime) {
            let distance = this.target[1] - this.originY;
    
            return distance / this.flyTime * liveTime + this.originY;
        }

        return this.target[1];
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

    emitPower() {
        this.createCoinFromEdge(2);
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
}

export class BlackCoin extends BaseCoin {
    constructor(
        x: number, y: number, lifeLong: number, coinPool: CoinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'black';
        this.fontColor = 'white';
    }

    emitPower() {
        this.createCoinFromEdge(5);
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

    emitPower() {
        this.createCoinFromEdge(20);
        this.isAlive = false;
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

    emitPower() {
        this.createCoinFromEdge();
        this.__pool__.score -= 2;
    }
}


export class BlueCoin extends BaseCoin {
    constructor(
        x: number, y: number, lifeLong: number, coinPool: CoinPool
    ) {
        super(x, y, lifeLong, coinPool);
        this.color = 'blue';
        this.fontColor = 'white';
        this.icon = '$';
        this.flyTime = 0;
    }

    updateX(liveTime: number) {
        return this.target[0];
    }

    updateY(liveTime: number) {
        return this.target[1];
    }
}
