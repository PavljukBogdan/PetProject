import * as PIXI from "pixi.js"
export class Loader {
    private config: any;

    public resources: { [key: string]: any } = {};
    constructor(config: any) {
        this.config = config;
    }

    preload() : Promise<void> {
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
