export class Hero {
    public x: number;
    public y: number;
    private render: (img: ImageBitmap) => void;

    constructor(config: {
        render: (img: ImageBitmap) => void;
    }) {

        this.render = config.render;
    }

}
