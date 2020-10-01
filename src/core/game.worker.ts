import { Game } from "./Game";

const workerCtx: Worker = self as any;

const game = new Game({
    render(img) {
        workerCtx.postMessage({ type: 'drawFrame', img });
    },
    onEnd(data) {
        workerCtx.postMessage({ type: 'gameEnd', data });
    }
});

workerCtx.addEventListener('message', e => {
    switch (e.data.msg) {
        case 'start':
            game.start();
            break;
        case 'add$':
            game.add$(e.data.$[0], e.data.$[1], e.data.$[2]);
            break;
        case 'click$':
            game.click$(e.data.position);
            break;
        default:
            break;
    }
});

export default () => workerCtx;
