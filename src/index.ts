import App from './App.svelte';

if (!(window as any).app) {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    const app = new App({
        target: dom
    });
    (window as any).app = app;
}
