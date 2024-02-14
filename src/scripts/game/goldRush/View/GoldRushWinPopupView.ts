import * as PIXI from "pixi.js";
import {App} from "../../../system/App";
import {Howl} from "howler";
import {Tools} from "../../../system/Tools";
import {GoldRushModel} from "../model/GoldRushModel";
import {gsap} from "gsap";

export class GoldRushWinPopupView {
    private container: PIXI.Container;
    private darkenContainer!: PIXI.Container;

    private static readonly buttonTextStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial', // зазвичай потрібно використовувати шрифт, схожий на той, що використовується на зображенні
        fontSize: 72,        // розмір шрифту потрібно підібрати так, щоб він відповідав зображенню
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
    private textTitle!: PIXI.Text;
    private textReward!: PIXI.Text;

    constructor(container: PIXI.Container) {
        this.container = container;
        this.createBackground();
        this.createTextFields();
        this.darkenContainer.visible = false;
    }

    public showPopup(coins: number, currentRewardType: string): Promise<void> {
        let self = this;
        const scaleUp: number = 1;
        const duration: number = 1;
        self.darkenContainer.position.x = GoldRushModel.SlotWindowSize.width / 2;
        self.darkenContainer.position.y = GoldRushModel.SlotWindowSize.height / 2;
        this.textTitle.text = currentRewardType;
        this.textReward.text = coins;
        this.textTitle.position.x = this.darkenContainer.width / 2 - this.textTitle.width / 2;
        this.textTitle.position.y = this.darkenContainer.height / 2 - this.textTitle.height / 2;
        this.textReward.pivot.x = - this.textTitle.width / 2 ;
        this.textReward.position.x = - this.textReward.width / 2;
        this.textReward.position.y = this.textReward.height;
        this.textReward.text = '';
        self.darkenContainer.visible = true;
        this.darkenContainer.scale.set(0.01, 0.01);
        return new Promise(function (resolve) {
            self.playScaleIconAnimation(self.darkenContainer, duration, scaleUp, () => {
                Tools.animateCoinsField(self.textReward, coins, 0).then(self.hidePopup.bind(self)).then(function () {
                    resolve();
                });
            });
        });
    }

    private hidePopup(): Promise<void> {
        let self = this;
        const duration: number = 1;
        const scaleDown: number = 0.01;
        return new Promise(function (resolve) {
            setTimeout(self.playScaleIconAnimation.bind(self,
                self.darkenContainer,
                duration,
                scaleDown,
                () => {
                    resolve();
                    self.darkenContainer.visible = false;
                }), 2000);
        });
    }

    private createBackground(): void {
        this.darkenContainer = new PIXI.Container();

        const darkenGraphics: PIXI.Graphics = new PIXI.Graphics();
        darkenGraphics.beginFill(0x000000, 0.75);
        darkenGraphics.drawRect(0, 0, GoldRushModel.SlotWindowSize.width, GoldRushModel.SlotWindowSize.height);
        darkenGraphics.endFill();

        this.darkenContainer.position.x = darkenGraphics.width / 2;
        this.darkenContainer.position.y = darkenGraphics.height / 2;
        this.darkenContainer.addChild(darkenGraphics);
        this.container.addChild(this.darkenContainer);
        this.darkenContainer.pivot.set(this.darkenContainer.width / 2, this.darkenContainer.height / 2);

    }

    private createTextFields(): void {
        this.textTitle = new PIXI.Text('', GoldRushWinPopupView.buttonTextStyle);
        this.textReward = new PIXI.Text('', GoldRushWinPopupView.buttonTextStyle);
        this.textTitle.addChild(this.textReward)
        this.darkenContainer.addChild(this.textTitle);
    }


    private playScaleIconAnimation(sprite: PIXI.Container, duration: number, scale: number, onComplete: Function): void {
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


}
