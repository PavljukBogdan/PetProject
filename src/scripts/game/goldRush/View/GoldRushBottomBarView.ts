import * as PIXI from "pixi.js";
import {GoldRushModel} from "../model/GoldRushModel";
import {App} from "../../../system/App";
import {Button} from "../../../system/Button";
import {parseKTX} from "pixi.js";

export class GoldRushBottomBarView {
    private buttonTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial', // зазвичай потрібно використовувати шрифт, схожий на той, що використовується на зображенні
        fontSize: 36,        // розмір шрифту потрібно підібрати так, щоб він відповідав зображенню
        fontStyle: 'normal', // зазвичай 'normal', 'italic' або 'oblique'
        fontWeight: 'bold',  // текст на кнопці виглядає жирним
        fill: ['#ffffff'],   // колір тексту; здається, що текст білого кольору
        stroke: '#000000',   // колір обводки тексту; можливо, чорний
        strokeThickness: 5,  // товщина обводки; потрібно підібрати експериментально
        dropShadow: true,    // включення тіні
        dropShadowColor: '#000000', // колір тіні; здається, що чорний
        dropShadowBlur: 0,   // розмиття тіні; на зображенні тінь чітка, тому розмиття не потрібно
        dropShadowAngle: Math.PI / 6, // кут падіння тіні; потрібно підібрати експериментально
        dropShadowDistance: 6,        // відстань тіні від тексту; потрібно підібрати експериментально
        wordWrap: true,      // увімкнення перенесення слів
        wordWrapWidth: 440,  // ширина області тексту, яка визначає, коли потрібно переносити слова
    });
    private container: PIXI.Container;
    private model: GoldRushModel;
    private bord!: PIXI.Sprite;
    private spinButton = new Button(
        'spin_button_norm',
        'spin_button_over',
        'spin_button_press',
        'spin_button_dis');
    private autoPlayButton = new Button(
        'button_left_norm',
        'button_left_over',
        'button_left_press',
        'button_left_dis');
    private maxBetButton = new Button(
        'button_left_norm',
        'button_left_over',
        'button_left_press',
        'button_left_dis');

    private betContainer: PIXI.Container = new PIXI.Container();
    private coinValueContainer: PIXI.Container = new PIXI.Container();
    private coinsContainer: PIXI.Container = new PIXI.Container();
    private increaseBet! : Function;
    private reduceBet! : Function;


    constructor(container: PIXI.Container, model: GoldRushModel) {
        this.container = container;
        this.model = model;
        this.createBord();
        this.addSpinButton();
        this.addAutoPlayButton();
        this.addMaxBetButton();
        this.addCoinsValue();
        this.addCoinBetValue();
    }

    private createBord(): void {
        this.bord = App.sprite("bord");
        this.bord.position.y = this.model.getSlotWindowSize().height - this.bord.height;
        this.container.addChild(this.bord);
    }

    private addSpinButton(): void {
        this.spinButton.position.x = this.bord.width / 2 - this.spinButton.width / 2;
        this.spinButton.position.y = this.bord.height / 2 - this.spinButton.height / 2;

        this.bord.addChild(this.spinButton);
    }

    private addMaxBetButton(): void {
        this.maxBetButton.setScale();
        const text = new PIXI.Text('MAX\nBET', this.buttonTextStyle);
        text.position.x = this.maxBetButton.width / 2 - text.width / 2 - this.maxBetButton.width;
        text.position.y = this.maxBetButton.height / 2 - text.height / 2;

        this.maxBetButton.addChild(text);
        this.maxBetButton.position.x = this.spinButton.position.x + this.autoPlayButton.width + this.spinButton.width;
        this.maxBetButton.position.y = this.spinButton.position.y + (this.spinButton.height - this.autoPlayButton.height);
        this.bord.addChild(this.maxBetButton);
    }

    private addAutoPlayButton(): void {
        const text = new PIXI.Text('AUTO\nPLAY', this.buttonTextStyle);
        text.position.x = this.autoPlayButton.width / 2 - text.width / 2;
        text.position.y = this.autoPlayButton.height / 2 - text.height / 2;
        this.autoPlayButton.addChild(text);
        this.autoPlayButton.position.x = this.spinButton.position.x - this.autoPlayButton.width;
        this.autoPlayButton.position.y = this.spinButton.position.y + (this.spinButton.height - this.autoPlayButton.height);
        this.bord.addChild(this.autoPlayButton);
    }

    private addCoinsValue(): void {
        const title = new PIXI.Text('coins', this.buttonTextStyle);
        const  coinsValue = new PIXI.Text('0', this.buttonTextStyle);
        title.name = 'title';
        coinsValue.name = 'coinsValue';
        title.y = - title.height;
        this.coinsContainer.x = this.bord.width - this.bord.width / 7;
        this.coinsContainer.addChild(title);
        this.coinsContainer.addChild(coinsValue);

        this.bord.addChild(this.coinsContainer);
    }


    private addCoinBetValue(): void {
        const self = this;
        const title = new PIXI.Text('coins value', this.buttonTextStyle);
        const coinsValue = new PIXI.Text('0', this.buttonTextStyle);
        const reduceText = new PIXI.Text('<', this.buttonTextStyle);
        const increaseText = new PIXI.Text('>', this.buttonTextStyle);
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
        reduceButton.on('pointerdown', function () {
            self.reduceBet && self.reduceBet();
        });

        increaseButton.on('pointerdown', function () {
            self.increaseBet && self.increaseBet();
        });

        title.name = 'title';
        coinsValue.name = 'coinsValue';
        reduceButton.name = 'reduceButton';
        increaseButton.name = 'increaseButton';
        title.y = - title.height;
        this.coinValueContainer.x = this.bord.width - this.bord.width / 3.5;
        coinsValue.addChild(reduceButton, increaseButton);
        this.coinValueContainer.addChild(title, coinsValue);

        this.bord.addChild(this.coinValueContainer);
    }

    public setCurrentBet(bet: number): void {
        //@ts-ignore
        let coinsText: PIXI.Text = this.coinValueContainer.getChildByName('coinsValue');
        //@ts-ignore
        let title: PIXI.Text = this.coinValueContainer.getChildByName('title');
        //@ts-ignore
        let reduceButton: PIXI.Text = coinsText.getChildByName('reduceButton');
        //@ts-ignore
        let increaseButton: PIXI.Text = coinsText.getChildByName('increaseButton');
        coinsText.text = bet;
        reduceButton.x = - coinsText.width + reduceButton.width / 2;
        increaseButton.x = coinsText.width;
        let  coinsX = coinsText.width / 2;
        let  titleX = title.width / 2;
        let positionY = this.bord.height / 2 - coinsText.height / 2
        coinsText.x = titleX - coinsX;
        coinsText.y = positionY;
    }

    public setUserCoins(coins: number): void {
        //@ts-ignore
        let coinsText: PIXI.Text = this.coinsContainer.getChildByName('coinsValue');
        //@ts-ignore
        let title: PIXI.Text = this.coinsContainer.getChildByName('title');
        coinsText.text = coins;
        let  coinsX = coinsText.width / 2;
        let  titleX = title.width / 2;
        coinsText.x = titleX - coinsX;
        coinsText.y = this.bord.height / 2 - coinsText.height / 2;
    }

    public setSpinButtonEvent(onClick: Function): void {
        this.spinButton.addClick(onClick.bind(this));
    }

    public setAutoPlayEvent(onClick: Function): void {
        this.autoPlayButton.addClick(onClick.bind(this));
    }

    public setMaxBetEvent(onClick: Function): void {
        this.maxBetButton.addClick(onClick.bind(this));
    }

    public increaseCurrentBet(onClick: Function): void {
        this.increaseBet = onClick;
    }

    public reduceCurrentBet(onClick: Function): void {
        this.reduceBet = onClick;
    }

    public disableSpinButton(): void {
        this.spinButton.setDisabled(true);
    }

    public enableSpinButton(): void {
        this.spinButton.setDisabled(false);
    }
}
