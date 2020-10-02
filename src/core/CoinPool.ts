import { BaseCoin, BlueCoin, GreenCoin, BlackCoin, OrangeCoin, BugCoin, RedCoin, Coin } from "./Coin";

export class CoinPool {
    public coins: Array<Coin> = [];
    public bothTime: number = performance.now();
    public score: number = 0;

    static coinClassMap = {
        base: BaseCoin,
        blue: BlueCoin,
        green: GreenCoin,
        black: BlackCoin,
        orange: OrangeCoin,
        bug: BugCoin,
        red: RedCoin
    }

    static chanceList = [
        {
            time: 5,
            data: {
                base: 80,
                blue: 0,
                green: 10,
                black: 5,
                orange: 2,
                bug: 2,
                red: 1
            }
        },
        {
            time: 10,
            data: {
                base: 50,
                blue: 0,
                green: 25,
                black: 15,
                orange: 5,
                bug: 3,
                red: 2
            }
        },
        {
            time: 15,
            data: {
                base: 30,
                blue: 0,
                green: 35,
                black: 20,
                orange: 7,
                bug: 4,
                red: 4
            }
        },
        {
            time: 20,
            data: {
                base: 20,
                blue: 0,
                green: 32,
                black: 27,
                orange: 9,
                bug: 6,
                red: 6
            }
        },
        {
            time: 25,
            data: {
                base: 5,
                blue: 0,
                green: 34,
                black: 34,
                orange: 11,
                bug: 10,
                red: 6
            }
        },
        {
            time: 30,
            data: {
                base: 0,
                blue: 0,
                green: 20,
                black: 53,
                orange: 11,
                bug: 10,
                red: 6
            }
        },
        {
            time: 500,
            data: {
                base: 0,
                blue: 0,
                green: 15,
                black: 60,
                orange: 9,
                bug: 10,
                red: 6
            }
        }
    ];

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
        let now = performance.now();
        let dis = (now - this.bothTime) / 1000;

        let o;
        let j = 0;
        CoinPool.chanceList.some(chance => {
            j = j + chance.time;

            if (dis < j) {
                o = chance.data;
                return true;
            }
            return false;
        });

        let i = 0;
        Object.keys(o).some(key => {
            i = i + o[key];
            if (randomK < i) {
                new CoinPool.coinClassMap[key](x, y, lifeLong, this);
                return true;
            }
            return false;
        });

        this.score++;
        this?.onScore(this.score);
    }

    reset() {
        this.score = 0;
        this.bothTime = performance.now();
    }
}
