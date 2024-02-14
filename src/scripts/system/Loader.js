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
exports.Loader = void 0;
const PIXI = __importStar(require("pixi.js"));
class Loader {
    constructor(config) {
        this.resources = {};
        this.config = config;
    }
    preload() {
        return new Promise(resolve => {
            for (const asset of this.config.loader) {
                let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
                key = key.substring(0, key.lastIndexOf('.'));
                if (asset.key.indexOf(".png") !== 1 || asset.key.indexOf(".jpg")) {
                    PIXI.Assets.load(asset.data.default).then(res => {
                        this.resources[key] = res;
                        if (Object.keys(this.resources).length >= this.config.loader.length) {
                            resolve();
                        }
                    });
                }
            }
        });
    }
}
exports.Loader = Loader;
