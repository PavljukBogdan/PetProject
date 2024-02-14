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
exports.GoldRushBottomBarView = void 0;
const PIXI = __importStar(require("pixi.js"));
const GoldRushModel_1 = require("../model/GoldRushModel");
const App_1 = require("../../../system/App");
const Button_1 = require("../../../system/Button");
const Tools_1 = require("../../../system/Tools");
class GoldRushBottomBarView {
    constructor(container, model) {
        this.spinButton = new Button_1.Button('spin_button_norm', 'spin_button_over', 'spin_button_press', 'spin_button_dis');
        this.autoPlayButton = new Button_1.Button('button_left_norm', 'button_left_over', 'button_left_press', 'button_left_dis');
        this.maxBetButton = new Button_1.Button('button_left_norm', 'button_left_over', 'button_left_press', 'button_left_dis');
        this.betContainer = new PIXI.Container();
        this.coinValueContainer = new PIXI.Container();
        this.coinsContainer = new PIXI.Container();
        this.container = container;
        this.model = model;
        this.createBord();
        this.addSpinButton();
        this.addAutoPlayButton();
        this.addMaxBetButton();
        this.addCoinsValue();
        this.addCoinBetValue();
        this.clickSound = Tools_1.Tools.playSound(GoldRushModel_1.GoldRushModel.SoundsNameSpace.click, 0.75);
    }
    createBord() {
        this.bord = App_1.App.sprite("bord");
        this.bord.position.y = GoldRushModel_1.GoldRushModel.SlotWindowSize.height - this.bord.height;
        this.container.addChild(this.bord);
    }
    addSpinButton() {
        this.spinButton.position.x = this.bord.width / 2 - this.spinButton.width / 2;
        this.spinButton.position.y = this.bord.height / 2 - this.spinButton.height / 2;
        this.bord.addChild(this.spinButton);
    }
    addMaxBetButton() {
        this.maxBetButton.setScale();
        const text = new PIXI.Text('MAX\nBET', GoldRushBottomBarView.buttonTextStyle);
        text.position.x = this.maxBetButton.width / 2 - text.width / 2 - this.maxBetButton.width;
        text.position.y = this.maxBetButton.height / 2 - text.height / 2;
        this.maxBetButton.addChild(text);
        this.maxBetButton.position.x = this.spinButton.position.x + this.autoPlayButton.width + this.spinButton.width;
        this.maxBetButton.position.y = this.spinButton.position.y + (this.spinButton.height - this.autoPlayButton.height);
        this.bord.addChild(this.maxBetButton);
    }
    addAutoPlayButton() {
        const text = new PIXI.Text('AUTO\nPLAY', GoldRushBottomBarView.buttonTextStyle);
        text.position.x = this.autoPlayButton.width / 2 - text.width / 2;
        text.position.y = this.autoPlayButton.height / 2 - text.height / 2;
        this.autoPlayButton.addChild(text);
        this.autoPlayButton.position.x = this.spinButton.position.x - this.autoPlayButton.width;
        this.autoPlayButton.position.y = this.spinButton.position.y + (this.spinButton.height - this.autoPlayButton.height);
        this.bord.addChild(this.autoPlayButton);
    }
    addCoinsValue() {
        const title = new PIXI.Text('coins', GoldRushBottomBarView.buttonTextStyle);
        const coinsValue = new PIXI.Text('0', GoldRushBottomBarView.buttonTextStyle);
        title.name = GoldRushBottomBarView.CoinsValueNameSpace.title;
        coinsValue.name = GoldRushBottomBarView.CoinsValueNameSpace.coinsValue;
        title.y = -title.height;
        this.coinsContainer.x = this.bord.width - this.bord.width / 7;
        this.coinsContainer.addChild(title);
        this.coinsContainer.addChild(coinsValue);
        this.bord.addChild(this.coinsContainer);
    }
    addCoinBetValue() {
        const self = this;
        const textStyle = GoldRushBottomBarView.buttonTextStyle;
        const title = new PIXI.Text('coins value', textStyle);
        const coinsValue = new PIXI.Text('0', textStyle);
        const freeGame = new PIXI.Text('FREE GAME', textStyle);
        const reduceText = new PIXI.Text('<', textStyle);
        const increaseText = new PIXI.Text('>', textStyle);
        const reduceButton = new PIXI.Container();
        reduceButton.width = reduceText.width;
        reduceButton.height = reduceText.height;
        reduceButton.addChild(reduceText);
        reduceButton.interactive = true;
        const increaseButton = new PIXI.Container();
        increaseButton.width = increaseText.width;
        increaseButton.height = increaseText.height;
        increaseButton.addChild(increaseText);
        increaseButton.interactive = true;
        reduceButton.on('pointerdown', () => {
            this.clickSound.play();
            self.reduceBet && self.reduceBet();
        });
        increaseButton.on('pointerdown', () => {
            this.clickSound.play();
            self.increaseBet && self.increaseBet();
        });
        title.name = GoldRushBottomBarView.CoinBetNameSpace.title;
        coinsValue.name = GoldRushBottomBarView.CoinBetNameSpace.coinsValue;
        freeGame.name = GoldRushBottomBarView.CoinBetNameSpace.freeGame;
        reduceButton.name = GoldRushBottomBarView.CoinBetNameSpace.reduceButton;
        increaseButton.name = GoldRushBottomBarView.CoinBetNameSpace.increaseButton;
        title.y = -title.height;
        freeGame.x = title.width / 2 - freeGame.width / 2;
        freeGame.y = this.bord.height / 2 - freeGame.height / 2;
        freeGame.visible = false;
        this.coinValueContainer.x = this.bord.width - this.bord.width / 3.5;
        coinsValue.addChild(reduceButton, increaseButton);
        this.coinValueContainer.addChild(title, coinsValue, freeGame);
        this.bord.addChild(this.coinValueContainer);
    }
    userCoinsUpdate(newValue, currentValue) {
        //@ts-ignore
        let coinsText = this.coinsContainer.getChildByName(GoldRushBottomBarView.CoinsValueNameSpace.coinsValue);
        return Tools_1.Tools.animateCoinsField(coinsText, newValue, currentValue);
    }
    setCurrentBet(bet) {
        //@ts-ignore
        let coinsText = this.coinValueContainer.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.coinsValue);
        //@ts-ignore
        let title = this.coinValueContainer.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.title);
        //@ts-ignore
        let reduceButton = coinsText.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.reduceButton);
        //@ts-ignore
        let increaseButton = coinsText.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.increaseButton);
        coinsText.text = bet;
        reduceButton.x = -reduceButton.width;
        increaseButton.x = coinsText.width;
        let coinsX = coinsText.width / 2;
        let titleX = title.width / 2;
        let positionY = this.bord.height / 2 - coinsText.height / 2;
        coinsText.x = titleX - coinsX;
        coinsText.y = positionY;
    }
    showFreeGame(show) {
        console.log(show);
        //@ts-ignore
        this.coinValueContainer.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.coinsValue).visible = !show;
        //@ts-ignore
        this.coinValueContainer.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.freeGame).visible = show;
    }
    setUserCoins(coins) {
        //@ts-ignore
        let coinsText = this.coinsContainer.getChildByName(GoldRushBottomBarView.CoinsValueNameSpace.coinsValue);
        //@ts-ignore
        let title = this.coinsContainer.getChildByName(GoldRushBottomBarView.CoinsValueNameSpace.title);
        coinsText.text = coins;
        let coinsX = coinsText.width / 2;
        let titleX = title.width / 2;
        coinsText.x = titleX - coinsX;
        coinsText.y = this.bord.height / 2 - coinsText.height / 2;
    }
    setSpinButtonEvent(onClick) {
        this.spinButton.addClick(onClick.bind(this));
    }
    setAutoPlayEvent(onClick) {
        this.autoPlayButton.addClick(onClick.bind(this));
    }
    setMaxBetEvent(onClick) {
        this.maxBetButton.addClick(onClick.bind(this));
    }
    increaseCurrentBet(onClick) {
        this.increaseBet = onClick;
    }
    reduceCurrentBet(onClick) {
        this.reduceBet = onClick;
    }
    disableAllButtons() {
        this.spinButton.setDisabled(true);
        this.autoPlayButton.setDisabled(true);
        this.maxBetButton.setDisabled(true);
        //@ts-ignore
        const coinsText = this.coinValueContainer.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.coinsValue);
        //@ts-ignore
        coinsText.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.reduceButton).interactive = false;
        // @ts-ignore
        coinsText.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.increaseButton).interactive = false;
    }
    enableAllButtons() {
        this.spinButton.setDisabled(false);
        this.autoPlayButton.setDisabled(false);
        this.maxBetButton.setDisabled(false);
        //@ts-ignore
        const coinsText = this.coinValueContainer.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.coinsValue);
        //@ts-ignore
        coinsText.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.reduceButton).interactive = true;
        // @ts-ignore
        coinsText.getChildByName(GoldRushBottomBarView.CoinBetNameSpace.increaseButton).interactive = true;
    }
}
exports.GoldRushBottomBarView = GoldRushBottomBarView;
GoldRushBottomBarView.buttonTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial', // зазвичай потрібно використовувати шрифт, схожий на той, що використовується на зображенні
    fontSize: 36, // розмір шрифту потрібно підібрати так, щоб він відповідав зображенню
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
GoldRushBottomBarView.CoinBetNameSpace = {
    title: "title",
    coinsValue: "coinsValue",
    freeGame: "freeGame",
    reduceButton: "reduceButton",
    increaseButton: "increaseButton"
};
GoldRushBottomBarView.CoinsValueNameSpace = {
    title: "title",
    coinsValue: "coinsValue"
};
