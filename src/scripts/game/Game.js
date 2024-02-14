"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const App_1 = require("../system/App");
const Scene_1 = require("../system/Scene");
class Game extends Scene_1.Scene {
    create() {
        this.createBackground();
    }
    createBackground() {
        this.background = App_1.App.sprite("bg");
        this.container.addChild(this.background);
        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;
    }
}
exports.Game = Game;
