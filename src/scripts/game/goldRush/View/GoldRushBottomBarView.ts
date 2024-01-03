import * as PIXI from "pixi.js";
import {GoldRushModel} from "../model/GoldRushModel";

export class GoldRushBottomBarView {
    private container: PIXI.Container;
    private model: GoldRushModel;
    private spinButton!: PIXI.Graphics;
    private buttonContainer!: PIXI.Container;
    constructor(container: PIXI.Container, model: GoldRushModel) {
        this.container = container;
        this.model = model;
        this.createButton();
    }

    private createButton(): void {
        this.buttonContainer = new PIXI.Container();
        this.spinButton = new PIXI.Graphics();
        this.spinButton.beginFill(0xff0000);
        this.spinButton.drawRect(0, 0, 200, 60);
        this.spinButton.endFill();
        this.spinButton.position.x = 650;
        this.spinButton.position.y = 1000;

        this.buttonContainer.addChild(this.spinButton);

        this.container.addChild(this.buttonContainer);

        this.buttonContainer.interactive = true;
    }

    public setSpinButton(onClick: Function): void {
        this.buttonContainer.on('pointerdown',onClick.bind(this));
    }

    public disableSpinButton(): void {
        this.buttonContainer.interactive = false;
    }

    public enableSpinButton(): void {
        this.buttonContainer.interactive = true;
    }
}
