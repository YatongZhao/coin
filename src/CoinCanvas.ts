import { canvasHeight, canvasWidth } from './canvasConfig';
import Worker from './index.worker';

export class CoinCanvas {
    public ctx: CanvasRenderingContext2D;
    public worker: Worker;
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
            window.requestAnimationFrame(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(e.data.img, 0, 0);
            });
        });
        
        let mouseX = 0;
        let mouseY = 0;
        let isMouseIn = false;
        
        const handleMouseMove = e => {
            mouseX = e.pageX - CANVAS_LEFT;
            mouseY = e.pageY - CANVAS_TOP;
            this.worker.postMessage({ msg: 'drawPoint', mouseX, mouseY });
        }
        
        this.canvas.addEventListener('mouseenter', () => {
            isMouseIn = true;
            this.canvas.addEventListener('mousemove', handleMouseMove);
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            isMouseIn = false;
            this.canvas.removeEventListener('mousemove', handleMouseMove);
        });
        
        this.canvas.addEventListener('click', e => {
            this.worker.postMessage({
                msg: 'click$',
                position: [e.pageX - CANVAS_LEFT, e.pageY - CANVAS_TOP]
            });
        });
        
    }

    start() {
        this.worker.postMessage({
            msg: 'add$',
            $: [canvasWidth/ 2, canvasHeight / 2, 7000]
        });
    }
}
