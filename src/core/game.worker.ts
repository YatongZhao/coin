import { Game } from "./Game";
import { Hero } from "./Hero";
import { CanvasRenderer } from "./CanvasRenderer";
import { gameWidth, gameHeight } from "./canvasConfig";

const workerCtx: Worker = self as any;

const game = new Game({
    render(img, x, y) {
        workerCtx.postMessage({ type: 'drawFrame', img, hero: { x, y } });
    },
    onEnd(data) {
        workerCtx.postMessage({ type: 'gameEnd', data });
    },
    onScore(score) {
        workerCtx.postMessage({ type: 'score', score });
    }
});

const hero = new Hero(gameWidth, gameHeight);
game.addPlayer1(hero);
game.initRenderer(new CanvasRenderer(game, gameWidth, gameHeight));

workerCtx.addEventListener('message', e => {
    switch (e.data.msg) {
        case 'start':
            game.start();
            break;
        case 'click$':
            game.click$(e.data.position);
            break;
        case 'hero-down-go':
            game.player1.moveY(1);
            break;
        case 'hero-down-cancel':
            game.player1.moveY(0);
            break;
        case 'hero-up-go':
            game.player1.moveY(-1);
            break;
        case 'hero-up-cancel':
            game.player1.moveY(0);
            break;
        case 'hero-left-go':
            game.player1.moveX(-1);
            break;
        case 'hero-left-cancel':
            game.player1.moveX(0);
            break;
        case 'hero-right-go':
            game.player1.moveX(1);
            break;
        case 'hero-right-cancel':
            game.player1.moveX(0);
            break;
        case 'hero-direction':
            game.player1.updateDirection(e.data.data.x, e.data.data.y);
            break;
        default:
            break;
    }
});

export default () => workerCtx;
