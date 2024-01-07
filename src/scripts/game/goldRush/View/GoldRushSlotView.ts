import * as PIXI from "pixi.js";
import {App} from "../../../system/App";
import {GoldRushModel} from "../model/GoldRushModel";
import {gsap} from "gsap";

export class GoldRushSlotView {

    private static readonly IconNameSpace = {
    sprite: "iconSprite"
}

    private container: PIXI.Container;
    private background!: PIXI.Sprite;
    private logo!: PIXI.Sprite;
    private reelsContainer!: PIXI.Sprite;
    private model: GoldRushModel;
    private rows: PIXI.Container[][] = [];
    private waitRows: Promise<void>[] = [];

    constructor(container: PIXI.Container, model: GoldRushModel) {
        this.container = container;
        this.model = model;
        this.createBackground();
        this.createLogo();
        this.createReelsContainer();
        this.createRows();
    }

    public startMoveRows(): Promise<void> {
        let self = this;

        this.waitRows = [];
        this.rows.forEach(function (row: PIXI.Container[], index: number) {
            self.waitRows.push(new Promise(function (resolve) {
                self.moveIcons(row, index, resolve);
            }));
        });
        return Promise.all(this.waitRows).then(this.checkRows.bind(this));
    }

    private checkRows(): Promise<void> {
        const self = this;
        const scaleDown: number = 1;
        const scaleUp: number = 1.2;
        const duration: number = 1;
        const wineLine = this.model.wineLineResult;
        return new Promise(function (resolve) {
            if (self.model.coinsWinLineTypes.indexOf(wineLine.winType) === -1) {
                resolve();
                return;
            }
            wineLine.line.forEach(function (itemIndex: number, index: number) {
                let icon: PIXI.Container = self.rows[index][itemIndex];
                if (icon.name === wineLine.icon) {
                    //@ts-ignore
                    let sprite: PIXI.Sprite = icon.getChildByName(GoldRushSlotView.IconNameSpace.sprite);
                    self.playScaleIconAnimation(sprite, duration, scaleUp, () => {
                        self.playScaleIconAnimation(sprite, duration, scaleDown, resolve);
                    });

                }
            });
        });
    }

    private playScaleIconAnimation(sprite: PIXI.Sprite, duration: number, scale: number, onComplete: Function): void {
        gsap.to(sprite.scale, {
            duration,
            x: scale,
            y: scale,
            ease: 'power3.in',
            transformOrigin: 'center center',
            onComplete: () => {
                onComplete();
            }
        });
    }



    private createBackground(): void {
        this.background = App.sprite("bg");
        this.container.addChild(this.background);
        this.background.width = this.model.slotWindowSize.width;
        this.background.height = this.model.slotWindowSize.height;
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
        this.model.getIcons().forEach((icon: string, index: number, array: string[]) => {
            let sprite: PIXI.Sprite = App.sprite(icon);
            sprite.name = GoldRushSlotView.IconNameSpace.sprite;
            sprite.anchor.set(0.5);
            sprite.position.x = sprite.width / 2;
            sprite.position.y = sprite.height / 2;
            let iconContainer: PIXI.Container = new PIXI.Container();
            iconContainer.name = icon;
            iconContainer.addChild(sprite);
            let startPositionY = -sprite.height * (array.length - visibleIcon);
            iconContainer.x = rowIndex * sprite.width + rowIndex * paddingX;
            iconContainer.y = startPositionY + index * sprite.height;
            self.reelsContainer.addChild(iconContainer);
            row.push(iconContainer);
        });
        return row;
    }

    private moveIcons(icons: PIXI.Container[], rowIndex: number, onComplete: Function): void {
        const self = this;
        const duration: number = 0.125;
        const startPositionY: number = icons[0].position.y
        const destinationY: number = -icons[length - 1].position.y;
        let wineLineResult = this.model.wineLineResult;
        let endPositionY = icons[wineLineResult.line[rowIndex]].position.y;
        let needStop: boolean = false;
        let waitPrevious: boolean = true;

        if (rowIndex - 1 < 0) {
            waitPrevious = false;
        } else {
            this.waitRows[rowIndex - 1].then(() => {
                waitPrevious = false
            });
        }

        icons.forEach(function (icon: PIXI.Container, index: number): void {
            let positionY: number = index + 1 < icons.length ? icons[index + 1].position.y : destinationY;
            gsap.to(icon, {
                duration: duration,
                y: positionY,
                ease: "none",
                onUpdate: function () {
                    if (!waitPrevious && (icon.name === wineLineResult.icon && endPositionY === icon.y)) {
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
                            self.moveIcons(icons, rowIndex, onComplete);
                        }

                    }
                }
            });
        });

    }
}
