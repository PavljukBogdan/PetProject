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
exports.Button = void 0;
const PIXI = __importStar(require("pixi.js"));
const App_1 = require("./App");
const Tools_1 = require("./Tools");
const GoldRushModel_1 = require("../game/goldRush/model/GoldRushModel");
class Button extends PIXI.Container {
    constructor(normalTexture, overTexture, pressTexture, disableTexture) {
        super();
        this.onButtonOver = () => {
            this.overState.visible = true;
            this.normalState.visible = false;
            this.pressState.visible = false;
            this.disableState.visible = false;
        };
        this.onButtonOut = () => {
            this.normalState.visible = true;
            this.overState.visible = false;
            this.pressState.visible = false;
            this.disableState.visible = false;
        };
        this.onButtonDown = () => {
            const clickSound = Tools_1.Tools.playSound(GoldRushModel_1.GoldRushModel.SoundsNameSpace.click, 0.75);
            clickSound.play();
            this.onClick && this.onClick();
            this.pressState.visible = true;
            this.normalState.visible = false;
            this.disableState.visible = false;
            this.overState.visible = false;
        };
        this.onButtonUp = () => {
            this.normalState.visible = true;
            this.pressState.visible = false;
            this.disableState.visible = false;
            this.overState.visible = false;
        };
        this.normalState = App_1.App.sprite(normalTexture);
        this.overState = App_1.App.sprite(overTexture);
        this.pressState = App_1.App.sprite(pressTexture);
        this.disableState = App_1.App.sprite(disableTexture);
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
    setDisabled(disabled) {
        this.normalState.visible = !disabled;
        this.disableState.visible = disabled;
        this.interactive = !disabled;
        !disabled && this.onButtonOut();
    }
    setScale() {
        this.normalState.scale.x = -1;
        this.overState.scale.x = -1;
        this.pressState.scale.x = -1;
        this.disableState.scale.x = -1;
    }
    addClick(onClick) {
        this.onClick = onClick;
    }
}
exports.Button = Button;
