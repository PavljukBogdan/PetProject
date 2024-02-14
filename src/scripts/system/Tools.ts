import {Howl} from 'howler';
import * as PIXI from "pixi.js";
import {App} from "./App";

type RequireContext = {
    keys: () => string[];
    <T>(key: string): T;
};
export type FileData = {
    key: string;
    data: any;
};
export class Tools {
    static massiveRequire(req : RequireContext): FileData[] {
        const files: any[] = [];
        req.keys().forEach((key: any) => {
            files.push(({
                key: key,
                data: req(key)
            }))
        });
        return files;
    }
    static playSound(path: string, volume: number): Howl {
        return new Howl({
            src: path,
            volume: volume,
            loop: false
        });
    }

    static playLoopSound(path: string, volume: number): Howl {
        return new Howl({
            src: path,
            volume: volume,
            loop: true
        });
    }

    static animateCoinsField(text: PIXI.Text, newValue: number, currentValue: number): Promise<void> {
        return new Promise<void>(function (resolve) {
            let elapsedTime: number = 1;
            let duration: number = 0.1;
            function update(delta: number): void {
                elapsedTime += delta;
                if (elapsedTime >= duration * 1000) {
                    text.text = newValue
                    resolve();
                    App.app.ticker.remove(update);
                } else {
                    const progress = Math.min(1, elapsedTime / (duration * 1000));
                    const newCoinsValue = Math.floor(currentValue + (newValue - currentValue) * progress);
                    text.text = newCoinsValue;
                }
            }
            App.app.ticker.add(update);
        });
    }
}
