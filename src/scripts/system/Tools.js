"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const howler_1 = require("howler");
const App_1 = require("./App");
class Tools {
    static massiveRequire(req) {
        const files = [];
        req.keys().forEach((key) => {
            files.push(({
                key: key,
                data: req(key)
            }));
        });
        return files;
    }
    static playSound(path, volume) {
        return new howler_1.Howl({
            src: path,
            volume: volume,
            loop: false
        });
    }
    static playLoopSound(path, volume) {
        return new howler_1.Howl({
            src: path,
            volume: volume,
            loop: true
        });
    }
    static animateCoinsField(text, newValue, currentValue) {
        return new Promise(function (resolve) {
            let elapsedTime = 1;
            let duration = 0.1;
            function update(delta) {
                elapsedTime += delta;
                if (elapsedTime >= duration * 1000) {
                    text.text = newValue;
                    resolve();
                    App_1.App.app.ticker.remove(update);
                }
                else {
                    const progress = Math.min(1, elapsedTime / (duration * 1000));
                    const newCoinsValue = Math.floor(currentValue + (newValue - currentValue) * progress);
                    text.text = newCoinsValue;
                }
            }
            App_1.App.app.ticker.add(update);
        });
    }
}
exports.Tools = Tools;
