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
exports.App = void 0;
const PIXI = __importStar(require("pixi.js"));
const Loader_1 = require("./Loader");
const ScenesManager_1 = require("./ScenesManager");
class Application {
    run(config) {
        this.config = config;
        this.app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(this.app.view);
        this.loader = new Loader_1.Loader(this.config);
        this.loader.preload().then(() => this.start());
        this.scenes = new ScenesManager_1.ScenesManager();
        this.app.stage.addChild(this.scenes.container);
    }
    start() {
        this.scenes.start("Game");
        this.scenes.start("GoldRushController");
    }
    sprite(key) {
        return new PIXI.Sprite(this.resources(key));
    }
    resources(key) {
        return this.loader.resources[key];
    }
}
exports.App = new Application();
