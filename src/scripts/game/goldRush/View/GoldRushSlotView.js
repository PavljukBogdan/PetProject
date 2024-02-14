"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldRushSlotView = void 0;
const PIXI = __importStar(require("pixi.js"));
const App_1 = require("../../../system/App");
const GoldRushModel_1 = require("../model/GoldRushModel");
const gsap_1 = require("gsap");
const Tools_1 = require("../../../system/Tools");
class GoldRushSlotView {
    constructor(container, model) {
        this.rows = [];
        this.waitRows = [];
        this.container = container;
        this.model = model;
        this.createBackground();
        this.createLogo();
        this.createReelsContainer();
        this.createRows();
    }
    startMoveRows() {
        let self = this;
        this.waitRows = [];
        const reelSound = Tools_1.Tools.playLoopSound(GoldRushModel_1.GoldRushModel.SoundsNameSpace.reels, 0.5);
        reelSound.play();
        this.rows.forEach(function (row, index) {
            self.waitRows.push(new Promise(function (resolve) {
                self.moveIcons(row, index, resolve);
            }));
        });
        return Promise.all(this.waitRows).then(() => {
            reelSound.stop();
        }).then(this.checkRows.bind(this));
    }
    checkRows() {
        const self = this;
        const scaleDown = 1;
        const scaleUp = 1.2;
        const duration = 1;
        const wineLine = this.model.wineLineResult;
        return new Promise(function (resolve) {
            if (self.model.coinsWinLineTypes.indexOf(wineLine.winType) === -1) {
                resolve();
                return;
            }
            wineLine.line.forEach(function (itemIndex, index) {
                let icon = self.rows[index][itemIndex];
                if (icon.name === wineLine.icon) {
                    //@ts-ignore
                    let sprite = icon.getChildByName(GoldRushSlotView.IconNameSpace.sprite);
                    self.playScaleIconAnimation(sprite, duration, scaleUp, () => {
                        self.playScaleIconAnimation(sprite, duration, scaleDown, resolve);
                    });
                }
            });
        });
    }
    playScaleIconAnimation(sprite, duration, scale, onComplete) {
        gsap_1.gsap.to(sprite.scale, {
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
    createBackground() {
        this.background = App_1.App.sprite("bg");
        this.container.addChild(this.background);
        this.background.width = GoldRushModel_1.GoldRushModel.SlotWindowSize.width;
        this.background.height = GoldRushModel_1.GoldRushModel.SlotWindowSize.height;
        const bkgSound = Tools_1.Tools.playLoopSound(GoldRushModel_1.GoldRushModel.SoundsNameSpace.bkg, 0.65);
        bkgSound.play();
    }
    createLogo() {
        this.logo = App_1.App.sprite("logo");
        this.container.addChild(this.logo);
        this.logo.position.x = this.background.width / 2 - this.logo.width / 2;
    }
    createReelsContainer() {
        this.reelsContainer = App_1.App.sprite("reel");
        this.reelsContainer.position.x = this.background.width / 2 - this.reelsContainer.width / 2;
        this.reelsContainer.position.y = this.logo.height;
        this.container.addChild(this.reelsContainer);
        const mask = new PIXI.Graphics();
        mask.clear();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, this.reelsContainer.width, this.reelsContainer.height);
        mask.endFill();
        this.reelsContainer.addChild(mask);
        this.reelsContainer.mask = mask;
    }
    createRows() {
        for (let i = 0; i < 5; i++) {
            let row = this.createRow(i);
            this.rows.push(row);
        }
    }
    createRow(rowIndex) {
        let self = this;
        const paddingX = 10;
        const visibleIcon = 3;
        let row = [];
        this.model.getIcons().forEach((icon, index, array) => {
            let sprite = App_1.App.sprite(icon);
            sprite.name = GoldRushSlotView.IconNameSpace.sprite;
            sprite.anchor.set(0.5);
            sprite.position.x = sprite.width / 2;
            sprite.position.y = sprite.height / 2;
            let iconContainer = new PIXI.Container();
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
    moveIcons(icons, rowIndex, onComplete) {
        const self = this;
        const duration = 0.125;
        const startPositionY = icons[0].position.y;
        const destinationY = -icons[length - 1].position.y;
        let wineLineResult = this.model.wineLineResult;
        let endPositionY = icons[wineLineResult.line[rowIndex]].position.y;
        let needStop = false;
        let waitPrevious = true;
        if (rowIndex - 1 < 0) {
            waitPrevious = false;
        }
        else {
            this.waitRows[rowIndex - 1].then(() => {
                waitPrevious = false;
            });
        }
        icons.forEach(function (icon, index) {
            let positionY = index + 1 < icons.length ? icons[index + 1].position.y : destinationY;
            gsap_1.gsap.to(icon, {
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
                        }
                        else {
                            self.moveIcons(icons, rowIndex, onComplete);
                        }
                    }
                }
            });
        });
    }
}
exports.GoldRushSlotView = GoldRushSlotView;
GoldRushSlotView.IconNameSpace = {
    sprite: "iconSprite"
};
