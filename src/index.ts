import { canvasHeight, canvasWidth } from './canvasConfig';
import Worker from './index.worker';

const worker = Worker();

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

document.body.appendChild(canvas);

const btn = document.createElement('button');
btn.innerHTML = 'start';
btn.addEventListener('click', () => {
    worker.postMessage({
        msg: 'add$',
        $: [canvasWidth/ 2, canvasHeight / 2, 7000]
    });
});

document.body.appendChild(btn);

const CANVAS_LEFT = canvas.offsetLeft;
const CANVAS_TOP = canvas.offsetTop;
worker.addEventListener('message', e => {
    window.requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(e.data.img, 0, 0);
    });
});

let mouseX = 0;
let mouseY = 0;
let isMouseIn = false;

const handleMouseMove = e => {
    mouseX = e.pageX - CANVAS_LEFT;
    mouseY = e.pageY - CANVAS_TOP;
    worker.postMessage({ msg: 'drawPoint', mouseX, mouseY });
}

canvas.addEventListener('mouseenter', () => {
    isMouseIn = true;
    canvas.addEventListener('mousemove', handleMouseMove);
});

canvas.addEventListener('mouseleave', () => {
    isMouseIn = false;
    canvas.removeEventListener('mousemove', handleMouseMove);
});

canvas.addEventListener('click', e => {
    worker.postMessage({
        msg: 'click$',
        position: [e.pageX - CANVAS_LEFT, e.pageY - CANVAS_TOP]
    });
});
