import * as PIXI from 'pixi.js';
import {App} from "./App";
import {Tools} from "./Tools"
import {GoldRushModel} from "../game/goldRush/model/GoldRushModel";

export class Button extends PIXI.Container {
    private normalState: PIXI.Sprite;
    private overState: PIXI.Sprite;
    private pressState: PIXI.Sprite;
    private disableState: PIXI.Sprite;
    private onClick!: Function;

    constructor(normalTexture: string, overTexture: string, pressTexture: string, disableTexture: string) {
        super();

        this.normalState = App.sprite(normalTexture);
        this.overState = App.sprite(overTexture);
        this.pressState = App.sprite(pressTexture);
        this.disableState = App.sprite(disableTexture);

        this.interactive = true;

        //this.on('pointerover', this.onButtonOver);
        this.on('pointerout', this.onButtonOut);
        this.on('pointerdown', this.onButtonDown);
        this.on('pointerup', this.onButtonUp);

        this.overState.visible = false;
        this.pressState.visible = false;
        this.disableState.visible = false;

        this.addChild(this.normalState, this.overState, this.pressState, this.disableState);
    }

    private onButtonOver = (): void => {
        this.overState.visible = true;
        this.normalState.visible = false;
        this.pressState.visible = false;
        this.disableState.visible = false;
    }

    private onButtonOut = (): void => {
        this.normalState.visible = true;
        this.overState.visible = false;
        this.pressState.visible = false;
        this.disableState.visible = false;
    }

    private onButtonDown = (): void => {
        const clickSound: Howl = Tools.playSound(GoldRushModel.SoundsNameSpace.click, 0.75);
        clickSound.play();
        this.onClick && this.onClick();
        this.pressState.visible = true;
        this.normalState.visible = false;
        this.disableState.visible = false;
        this.overState.visible = false;
    }

    private onButtonUp = (): void => {
        this.normalState.visible = true;
        this.pressState.visible = false;
        this.disableState.visible = false;
        this.overState.visible = false;
    }

    public setDisabled(disabled: boolean): void {
        this.normalState.visible = !disabled;
        this.disableState.visible = disabled;
        this.interactive = !disabled;
        !disabled && this.onButtonOut();
    }

    public setScale():void {
        this.normalState.scale.x = -1;
        this.overState.scale.x = -1;
        this.pressState.scale.x = -1;
        this.disableState.scale.x = -1;
    }

    public addClick(onClick: Function): void {
        this.onClick = onClick;
    }
}
