import { canvasHeight, canvasWidth } from './canvasConfig';
import Worker from './game.worker';

export class CoinCanvas {
    public ctx: CanvasRenderingContext2D;
    public worker: Worker;
    private endHandlerList: Array<Function>;
    constructor(public canvas: HTMLCanvasElement) {
        this.init();
    }

    init() {
        this.worker = Worker();
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        const CANVAS_LEFT = this.canvas.offsetLeft;
        const CANVAS_TOP = this.canvas.offsetTop;

        this.worker.addEventListener('message', e => {

            if (e.data.type === 'drawFrame') {
                window.requestAnimationFrame(() => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(e.data.img, 0, 0);
                });
            }
        });

        this.canvas.addEventListener('click', e => {
            this.worker.postMessage({
                msg: 'click$',
                position: [e.pageX - CANVAS_LEFT, e.pageY - CANVAS_TOP]
            });
        });
        
    }

    start() {
        this.worker.postMessage({ msg: 'start' });
    }

    addEventListener(handle: 'end', handler: Function) {
        switch (handle) {
            case 'end':
                this.endHandlerList.push(handler);
                break;
            default:
                break;
        }
    }
}
