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
exports.GoldRushWinPopupView = void 0;
const PIXI = __importStar(require("pixi.js"));
const Tools_1 = require("../../../system/Tools");
const GoldRushModel_1 = require("../model/GoldRushModel");
const gsap_1 = require("gsap");
class GoldRushWinPopupView {
    constructor(container) {
        this.container = container;
        this.createBackground();
        this.createTextFields();
        this.darkenContainer.visible = false;
    }
    showPopup(coins, currentRewardType) {
        let self = this;
        const scaleUp = 1;
        const duration = 1;
        self.darkenContainer.position.x = GoldRushModel_1.GoldRushModel.SlotWindowSize.width / 2;
        self.darkenContainer.position.y = GoldRushModel_1.GoldRushModel.SlotWindowSize.height / 2;
        this.textTitle.text = currentRewardType;
        this.textReward.text = coins;
        this.textTitle.position.x = this.darkenContainer.width / 2 - this.textTitle.width / 2;
        this.textTitle.position.y = this.darkenContainer.height / 2 - this.textTitle.height / 2;
        this.textReward.pivot.x = -this.textTitle.width / 2;
        this.textReward.position.x = -this.textReward.width / 2;
        this.textReward.position.y = this.textReward.height;
        this.textReward.text = '';
        self.darkenContainer.visible = true;
        this.darkenContainer.scale.set(0.01, 0.01);
        return new Promise(function (resolve) {
            self.playScaleIconAnimation(self.darkenContainer, duration, scaleUp, () => {
                Tools_1.Tools.animateCoinsField(self.textReward, coins, 0).then(self.hidePopup.bind(self)).then(function () {
                    resolve();
                });
            });
        });
    }
    hidePopup() {
        let self = this;
        const duration = 1;
        const scaleDown = 0.01;
        return new Promise(function (resolve) {
            setTimeout(self.playScaleIconAnimation.bind(self, self.darkenContainer, duration, scaleDown, () => {
                resolve();
                self.darkenContainer.visible = false;
            }), 2000);
        });
    }
    createBackground() {
        this.darkenContainer = new PIXI.Container();
        const darkenGraphics = new PIXI.Graphics();
        darkenGraphics.beginFill(0x000000, 0.75);
        darkenGraphics.drawRect(0, 0, GoldRushModel_1.GoldRushModel.SlotWindowSize.width, GoldRushModel_1.GoldRushModel.SlotWindowSize.height);
        darkenGraphics.endFill();
        this.darkenContainer.position.x = darkenGraphics.width / 2;
        this.darkenContainer.position.y = darkenGraphics.height / 2;
        this.darkenContainer.addChild(darkenGraphics);
        this.container.addChild(this.darkenContainer);
        this.darkenContainer.pivot.set(this.darkenContainer.width / 2, this.darkenContainer.height / 2);
    }
    createTextFields() {
        this.textTitle = new PIXI.Text('', GoldRushWinPopupView.buttonTextStyle);
        this.textReward = new PIXI.Text('', GoldRushWinPopupView.buttonTextStyle);
        this.textTitle.addChild(this.textReward);
        this.darkenContainer.addChild(this.textTitle);
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
}
exports.GoldRushWinPopupView = GoldRushWinPopupView;
GoldRushWinPopupView.buttonTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial', // зазвичай потрібно використовувати шрифт, схожий на той, що використовується на зображенні
    fontSize: 72, // розмір шрифту потрібно підібрати так, щоб він відповідав зображенню
    fontStyle: 'normal', // зазвичай 'normal', 'italic' або 'oblique'
    fontWeight: 'bold', // текст на кнопці виглядає жирним
    fill: ['#ffffff'], // колір тексту; здається, що текст білого кольору
    stroke: '#000000', // колір обводки тексту; можливо, чорний
    strokeThickness: 5, // товщина обводки; потрібно підібрати експериментально
    dropShadow: true, // включення тіні
    dropShadowColor: '#000000', // колір тіні; здається, що чорний
    dropShadowBlur: 0, // розмиття тіні; на зображенні тінь чітка, тому розмиття не потрібно
    dropShadowAngle: Math.PI / 6, // кут падіння тіні; потрібно підібрати експериментально
    dropShadowDistance: 6, // відстань тіні від тексту; потрібно підібрати експериментально
    wordWrap: true, // увімкнення перенесення слів
    wordWrapWidth: 440, // ширина області тексту, яка визначає, коли потрібно переносити слова
});
