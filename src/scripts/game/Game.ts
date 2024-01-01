import * as PIXI from "pixi.js";
import {App} from "../system/App";
import {Scene} from "../system/Scene";

export class Game extends Scene {
    private background!: PIXI.Sprite;
    create() {
        this.createBackground();
    }

    private createBackground(): void {
        this.background = App.sprite("bg");
        this.container.addChild(this.background);
        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;
    }
}
