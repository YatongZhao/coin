import type { Game } from "./Game";

export class Hero {
    public x: number;
    public y: number;
    public game: Game | null;
    // 0.01px / 1ms
    public speed: number = 0.0002;
    public heroR = 14;

    public directionX: number = 0;
    public directionY: number = 0;

    private lastTime: number = performance.now();

    constructor(
        private canvasWidth: number,
        private canvasHeight: number
    ) {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
    }

    state() {
        let time = performance.now();
        this.x = this.directionX * this.speed * (time - this.lastTime) + this.x;
        this.y = this.directionY * this.speed * (time - this.lastTime) + this.y;

        this.x = this.x > this.canvasWidth - this.heroR ? this.canvasWidth - this.heroR : this.x;
        this.x = this.x < this.heroR ? this.heroR : this.x;

        this.y = this.y > this.canvasHeight - this.heroR ? this.canvasHeight - this.heroR : this.y;
        this.y = this.y < this.heroR ? this.heroR : this.y;

        this.lastTime = time;
        
        return this;
    }

    contactGame(game: Game) {
        this.game = game;
    }

    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
    }

    moveX(x: number) {
        this.state();
        this.directionX = x;
    }

    moveY(y: number) {
        this.state();
        this.directionY = y;
    }

    updateDirection(x, y) {
        let r = x ** 2 + y ** 2;
        if (r !== 0) {
            this.directionX = (x * (x ** 2 + y ** 2) ** 0.5);
            this.directionY = (y * (x ** 2 + y ** 2) ** 0.5);
        } else {
            this.directionX = 0;
            this.directionY = 0;
        }
    }
}
