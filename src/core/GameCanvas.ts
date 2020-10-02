import Worker from './game.worker';

export interface GameCanvasConfig {
    onEnd?: (data: any) => void;
    onScore?: (score: number) => void;
    onRender?: (x: number, y: number) => void;
};

export class GameCanvas {
    public ctx: CanvasRenderingContext2D;
    public worker: Worker;
    private onEnd: (data: any) => void;
    private onScore: (score: number) => void;
    private onRender: (x: number, y: number) => void;

    private directionX: number = 0;
    private directionY: number = 0;

    private touchOriginX: number = 0;
    private touchOriginY: number = 0;

    constructor(public canvas: HTMLCanvasElement, config?: GameCanvasConfig) {
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.onEnd = config?.onEnd;
        this.onScore = config?.onScore;
        this.onRender = config?.onRender;

        this.init();
    }

    init() {
        this.worker = Worker();
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        const rect = this.canvas.getBoundingClientRect();
        const CANVAS_LEFT = rect.left;
        const CANVAS_TOP = rect.top;

        this.worker.addEventListener('message', e => {

            switch (e.data.type) {
                case 'drawFrame':
                    this.drawFrame(e.data.img, e.data.hero.x, e.data.hero.y);
                    this?.onRender(e.data.hero.x, e.data.hero.y);
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
        
        window.addEventListener('keydown', (e) => {
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 40:
                    this.worker.postMessage({ msg: 'hero-down-go' });
                    break;
                case 38:
                    this.worker.postMessage({ msg: 'hero-up-go' });
                    break;
                case 37:
                    this.worker.postMessage({ msg: 'hero-left-go' });
                    break;
                case 39:
                    this.worker.postMessage({ msg: 'hero-right-go' });
                    break;
            
                default:
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 40:
                    this.worker.postMessage({ msg: 'hero-down-cancel' });
                    break;
                case 38:
                    this.worker.postMessage({ msg: 'hero-down-cancel' });
                    break;
                case 37:
                    this.worker.postMessage({ msg: 'hero-left-cancel' });
                    break;
                case 39:
                    this.worker.postMessage({ msg: 'hero-right-cancel' });
                    break;
                default:
                    break;
            }
        });

        window.addEventListener('touchstart', (e) => {
            this.touchOriginX = e.targetTouches[0].screenX;
            this.touchOriginY = e.targetTouches[0].screenY;

            window.addEventListener('touchmove', this.handleTouchMove);
        });

        window.addEventListener('touchend', (e) => {
            this.touchOriginX = 0;
            this.touchOriginY = 0;

            this.directionX = 0;
            this.directionY = 0;

            window.removeEventListener('touchmove', this.handleTouchMove);
            this.updateHeroDirection();
        });

    }

    handleTouchMove(e: TouchEvent) {
        // e.preventDefault();
        // e.stopPropagation();

        let max = 30;

        this.directionX += (e.targetTouches[0].screenX - this.touchOriginX);
        this.directionY += (e.targetTouches[0].screenY - this.touchOriginY);

        let length = this.directionX ** 2 + this.directionY ** 2;

        if (length > max ** 2) {
            this.directionX = max / length ** 0.5 * this.directionX;
            this.directionY = max / length ** 0.5 * this.directionY;
        }

        this.touchOriginX = e.targetTouches[0].screenX;
        this.touchOriginY = e.targetTouches[0].screenY;
        this.updateHeroDirection();
    }

    updateHeroDirection() {
        this.worker.postMessage({ msg: 'hero-direction', data: { x: this.directionX, y: this.directionY } });
    }

    start() {
        this.worker.postMessage({ msg: 'start' });
    }

    drawFrame(img: CanvasImageSource, x: number, y:number) {
        const sx = x - this.canvas.width / 2;
        const sy = y - this.canvas.height / 2;

        const sw = this.canvas.width;
        const sh = this.canvas.height;

        const dx = 0;
        const dy = 0;

        const dw = this.canvas.width;
        const dh = this.canvas.height;

        window.requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        });
    }
}
