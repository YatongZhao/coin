import { Game } from "./Game";

const workerCtx: Worker = self as any;

const game = new Game({
    render(img) {
        workerCtx.postMessage({ type: 'drawFrame', img });
    },
    onEnd(data) {
        workerCtx.postMessage({ type: 'gameEnd', data });
    },
    onScore(score) {
        workerCtx.postMessage({ type: 'score', score });
    }
});

workerCtx.addEventListener('message', e => {
    switch (e.data.msg) {
        case 'start':
            game.start();
            break;
        case 'click$':
            game.click$(e.data.position);
            break;
        default:
            break;
    }
});

export default () => workerCtx;
