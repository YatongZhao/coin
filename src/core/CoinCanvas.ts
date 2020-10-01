import { canvasHeight, canvasWidth } from './canvasConfig';
import Worker from './game.worker';

export interface CoinCanvasConfig {
    onEnd?: (data: any) => void;
    onScore?: (score: number) => void;
};

export class CoinCanvas {
    public ctx: CanvasRenderingContext2D;
    public worker: Worker;
    private onEnd: (data: any) => void;
    private onScore: (score: number) => void;

    constructor(public canvas: HTMLCanvasElement, config?: CoinCanvasConfig) {
        this.onEnd = config?.onEnd;
        this.onScore = config?.onScore;

        this.init();
    }

    init() {
        this.worker = Worker();
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        const rect = this.canvas.getBoundingClientRect();
        const CANVAS_LEFT = rect.left;
        const CANVAS_TOP = rect.top;

        this.worker.addEventListener('message', e => {

            switch (e.data.type) {
                case 'drawFrame':
                    this.drawFrame(e.data.img);
                    break;
                case 'gameEnd':
                    this?.onEnd(e.data.data);
                    break;
                case 'score':
                    this?.onScore(e.data.score);
                    break;
                default:
                    break;
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

    drawFrame(img: CanvasImageSource) {
        window.requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        });
    }
}
