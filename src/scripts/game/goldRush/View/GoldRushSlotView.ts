import * as PIXI from "pixi.js";
import {App} from "../../../system/App";
import {GoldRushModel} from "../model/GoldRushModel";

import {gsap} from "gsap";


export class GoldRushSlotView {
    private container: PIXI.Container;
    private background!: PIXI.Sprite;
    private logo!: PIXI.Sprite;
    private reelsContainer!: PIXI.Sprite;
    private model: GoldRushModel;
    private rows: PIXI.Container[][] = [];
    private text!: PIXI.Text;
    private emitter = new PIXI.utils.EventEmitter();

    constructor(container: PIXI.Container, model: GoldRushModel) {
        this.container = container;
        this.model = model;
        this.createBackground();
        this.createLogo();
        this.createReelsContainer();
        this.createRows();
    }

    private rowsQueue: Promise<void>[] = [];

    public startMoveRows(): Promise<void>[] {
        let self = this;
        let iconsToMove: number = 0;

        this.rowsQueue = [];
        this.rows.forEach(function (row:PIXI.Container[], index: number) {
            self.rowsQueue.push(new Promise(function (resolve) {
                self.moveIcons(row, index, iconsToMove, resolve);
            }));
        });Promise.all(this.rowsQueue).then(()=> {console.log(this.rows)});
        return this.rowsQueue;
    }

    private createBackground(): void {
        this.background = App.sprite("bg");
        this.container.addChild(this.background);
        this.background.width = this.model.getSlotWindowSize().width;
        this.background.height = this.model.getSlotWindowSize().height;
    }

    private createLogo(): void {
        this.logo = App.sprite("logo");
        this.container.addChild(this.logo);
        this.logo.position.x = this.background.width / 2 - this.logo.width / 2;
    }

    private createReelsContainer(): void {
        this.reelsContainer = App.sprite("reel");
        this.reelsContainer.position.x = this.background.width / 2 - this.reelsContainer.width / 2;
        this.reelsContainer.position.y = this.logo.height;
        this.container.addChild(this.reelsContainer);

        const mask: PIXI.Graphics = new PIXI.Graphics();
        mask.clear();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, this.reelsContainer.width, this.reelsContainer.height);
        mask.endFill();

        this.reelsContainer.addChild(mask);
        this.reelsContainer.mask = mask;
    }

    private createRows(): void {
        for (let i = 0; i < 5; i++) {
            let row: PIXI.Container[] = this.createRow(i);
            this.rows.push(row);
        }
    }

    private createRow(rowIndex: number): PIXI.Container[] {
        let self = this;
        const paddingX: number = 10
        const visibleIcon: number = 3;
        let row: PIXI.Container[] = [];
        let currentRow: string[] = [];
        this.model.getIcons().forEach((icon: string, index: number, array: string[]) => {
            let sprite: PIXI.Sprite = App.sprite(icon);
            let iconContainer: PIXI.Container = new PIXI.Container();
            iconContainer.name = icon;
            currentRow.push(iconContainer.name);
            this.text = new PIXI.Text(index, {fontFamily: 'Arial', fontSize: 48, fill: 0xff0000});
            iconContainer.addChild(sprite);
            iconContainer.addChild(this.text);
            let startPositionY = -sprite.height * (array.length - visibleIcon);
            iconContainer.x = rowIndex * sprite.width + rowIndex * paddingX;
            iconContainer.y = startPositionY + index * sprite.height;
            this.text.text = iconContainer.y;
            self.reelsContainer.addChild(iconContainer);
            row.push(iconContainer);
        });
        return row;
    }

    private moveIcons(icons: PIXI.Container[], rowIndex: number, iconsToMove: number, onComplete: Function): void {
        const self = this;
        const duration: number = 0.125;
        const startPositionY: number = icons[0].position.y
        const destinationY: number = - icons[length - 1].position.y;
        let wineLineResult = self.model.getWineLine();
        let endPositionY = icons[wineLineResult.line[rowIndex]].position.y;
        let needStop: boolean = false;
        let waitPrevious: boolean = true;
        if (rowIndex - 1 < 0) {
            waitPrevious = false;
        } else {
            this.rowsQueue[rowIndex - 1].then(() => {
                waitPrevious = false
            });
        }

        icons.forEach(function (icon: PIXI.Container, index: number) {
            let yPosition: number = index + 1 < icons.length ? icons[index + 1].position.y : destinationY;
            gsap.to(icon, {
                duration: duration,
                y: yPosition,
                ease: "none",
                onUpdate: function () {
                    if (iconsToMove === 0 && (icon.name === wineLineResult.icon && endPositionY === icon.y)) {
                        needStop = true;
                    }
                },
                onComplete: function () {
                    if (icon.position.y >= destinationY) {
                        icon.position.y = startPositionY;
                        icons.splice(index, 1);
                        icons.unshift(icon);

                        if (needStop && !waitPrevious) {
                            onComplete && onComplete();
                        } else {
                            iconsToMove > 0 && iconsToMove--;
                            self.moveIcons(icons, rowIndex, iconsToMove, onComplete);
                        }

                    }
                }
            });
        });

    }
}
