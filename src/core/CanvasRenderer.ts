import type { Game } from "./Game";
import { coinR } from './canvasConfig';
import type { Coin } from "./Coin";

export class CanvasRenderer {
    private offscreen: OffscreenCanvas;
    private ctx: OffscreenCanvasRenderingContext2D;

    constructor(
        private game: Game,
        public canvasWidth: number,
        public canvasHeight: number) {
        this.offscreen = new OffscreenCanvas(this.canvasWidth, this.canvasHeight);
        this.ctx = this.offscreen.getContext('2d');
    }

    render() {
        this.ctx.clearRect(2, 2, this.offscreen.width - 4, this.offscreen.height - 4);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.offscreen.width, this.offscreen.height);

        this.renderHero();
        if (this.game.status === 'running') {
            this.renderTime();
            this.renderScore();
        }
        this.renderCoin();

        return this.offscreen.transferToImageBitmap();
    }

    drawCoin(coin: Coin) {
        const { x, y, color, fontColor, livePercent, icon } = coin;
        this.ctx.beginPath();
        this.ctx.arc(x, y, coinR, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 4;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
        this.ctx.arc(x, y, coinR, 0, 2 * Math.PI * livePercent);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fill();
    
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = fontColor;
        this.ctx.font = "bold 22px '微软雅黑'";
        this.ctx.fillText(icon, x, y + 8);
        this.ctx.closePath();
    }

    renderCoin() {
        this.game.filterCoinPool(coin => {
            if (coin.isAlive) {
                this.drawCoin(coin);
            }
        });
    }

    renderTime() {
        this.ctx.beginPath();

        this.ctx.font = 'italic small-caps bold 80px arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = 'gray';
        this.ctx.fillText('time', this.canvasWidth / 2 + 200, this.canvasHeight / 2 - 80);
        let time = (performance.now() - this.game.coinPool.bothTime) / 1000;
        this.ctx.font = 'italic small-caps bold 40px arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = 'red';
        this.ctx.fillText(`${time.toFixed(3)}`, this.canvasWidth / 2 + 220, this.canvasHeight / 2 - 80);

        this.ctx.closePath();
    }

    renderScore() {
        this.ctx.beginPath();

        this.ctx.font = 'italic small-caps bold 80px arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('score', this.canvasWidth / 2 - 100, this.canvasHeight - 200);
        let score = this.game.coinPool.score;
        this.ctx.font = 'italic small-caps bold 40px arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = 'red';
        this.ctx.fillText(`${score}`, this.canvasWidth / 2 - 80, this.canvasHeight - 200);

        this.ctx.closePath();
    }

    renderHero() {
        if (!this.game.player1) {
            return;
        }
        let state = this.game.player1.state();

        this.ctx.beginPath();
        this.ctx.arc(state.x, state.y, this.game.player1.heroR, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 4;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fill();
        this.ctx.closePath();
    }
}
