import type { Game } from "./Game";
import { canvasWidth, canvasHeight, coinR } from './canvasConfig';
import type { Coin } from "./Coin";

export class CanvasRenderer {
    private game: Game;
    private offscreen: OffscreenCanvas;
    private ctx: OffscreenCanvasRenderingContext2D;

    constructor(game: Game) {
        this.game = game;
        this.offscreen = new OffscreenCanvas(canvasWidth, canvasHeight);
        this.ctx = this.offscreen.getContext('2d');
    }

    render() {
        this.ctx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);

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
    
        this.ctx.fillStyle = fontColor;
        this.ctx.font = "bold 22px '微软雅黑'";
        this.ctx.fillText(icon, x, y + 8);
        this.ctx.textAlign = 'center';
        this.ctx.closePath();
    }

    renderCoin() {
        this.game.filterCoinPool(coin => {
            if (coin.isAlive) {
                this.drawCoin(coin);
            }
        });
    }
}
