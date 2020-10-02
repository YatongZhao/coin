import { canvasHeight, canvasWidth, coinR } from './canvasConfig';
import type { CoinPool } from './CoinPool';

export class Coin {
    public color: string = 'yellow';
    public fontColor: string = 'black';
    public icon: string = '$';
    public bothTime: number = performance.now();
    public isAlive: boolean = true;
    public livePercent: number = 0;
    public flyTime: number = 700;

    constructor(
        public x: number,
        public y: number,
        public lifeLong: number,
        public __pool__: CoinPool
    ) {
        this.lifeLong = lifeLong * (1 / ((this.bothTime - __pool__.bothTime) / 2500 + 1));
        __pool__.coins.push(this);
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
    public target: [number, number];
    public originX: number;
    public originY: number;

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

    tryClick(point: [number, number]) {
        if (!this.isClicked(point)) {
            return false;
        }

        this.__pool__.createCoin(
            this.x,
            this.y,
            5000
        );

        return true;
    }

    updateX(liveTime: number) {
        return this.target[0];
    }

    updateY(liveTime: number) {
        return this.target[1];
    }
}

// export class CoinPool {
//     public coins: Array<Coin> = [];
//     public bothTime: number = performance.now();
//     public score: number = 0;

//     static coinClassMap = {
//         base: BaseCoin,
//         blue: BlueCoin,
//         green: GreenCoin,
//         black: BlackCoin,
//         orange: OrangeCoin,
//         bug: BugCoin,
//         red: RedCoin
//     }

//     static chanceList = [
//         {
//             time: 5,
//             data: {
//                 base: 40,
//                 blue: 40,
//                 green: 10,
//                 black: 5,
//                 orange: 2,
//                 bug: 2,
//                 red: 1
//             }
//         },
//         {
//             time: 10,
//             data: {
//                 base: 30,
//                 blue: 20,
//                 green: 25,
//                 black: 15,
//                 orange: 5,
//                 bug: 3,
//                 red: 2
//             }
//         },
//         {
//             time: 15,
//             data: {
//                 base: 20,
//                 blue: 10,
//                 green: 35,
//                 black: 20,
//                 orange: 7,
//                 bug: 4,
//                 red: 4
//             }
//         },
//         {
//             time: 20,
//             data: {
//                 base: 15,
//                 blue: 5,
//                 green: 32,
//                 black: 27,
//                 orange: 9,
//                 bug: 6,
//                 red: 6
//             }
//         },
//         {
//             time: 25,
//             data: {
//                 base: 5,
//                 blue: 0,
//                 green: 34,
//                 black: 34,
//                 orange: 11,
//                 bug: 10,
//                 red: 6
//             }
//         },
//         {
//             time: 30,
//             data: {
//                 base: 0,
//                 blue: 0,
//                 green: 20,
//                 black: 53,
//                 orange: 11,
//                 bug: 10,
//                 red: 6
//             }
//         },
//         {
//             time: 500,
//             data: {
//                 base: 0,
//                 blue: 0,
//                 green: 15,
//                 black: 60,
//                 orange: 9,
//                 bug: 10,
//                 red: 6
//             }
//         }
//     ];

//     constructor(private onScore: (score: number) => void) {}

//     tryClick(point: [number, number]) {
//         for (let i = this.coins.length - 1; i >= 0; i--) {
//             let isClicked = this.coins[i].tryClick(point);
//             if (isClicked) {
//                 break;
//             }
//         }
//     }

//     createCoin(x: number, y: number, lifeLong: number) {
//         let randomK = Math.random() * 100;
//         let now = performance.now();
//         let dis = (now - this.bothTime) / 1000;

//         let o;
//         let j = 0;
//         CoinPool.chanceList.some(chance => {
//             j = j + chance.time;

//             if (dis < j) {
//                 o = chance.data;
//                 return true;
//             }
//             return false;
//         });

//         let i = 0;
//         Object.keys(o).some(key => {
//             i = i + o[key];
//             if (randomK < i) {
//                 new CoinPool.coinClassMap[key](x, y, lifeLong, this);
//                 return true;
//             }
//             return false;
//         });

//         this.score++;
//         this?.onScore(this.score);
//     }

//     reset() {
//         this.score = 0;
//         this.bothTime = performance.now();
//     }
// }
