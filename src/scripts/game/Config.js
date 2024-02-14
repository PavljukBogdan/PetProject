"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const Tools_1 = require("../system/Tools");
const Game_1 = require("./Game");
const GoldRushController_1 = require("./goldRush/GoldRushController");
exports.Config = {
    scenes: {
        Game: Game_1.Game,
        GoldRushController: GoldRushController_1.GoldRushController
    },
    loader: Tools_1.Tools.massiveRequire(require.context('./../../assets/', true, /\.(mp3|png|jpe?g)$/))
};
