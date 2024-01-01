import * as PIXI from "pixi.js"
import {Loader} from "./Loader";
import {Config} from "../game/Config";
import {ScenesManager} from "./ScenesManager";

class Application {
    private scenes!: ScenesManager;
    public loader!: Loader
    public app!: PIXI.Application<HTMLCanvasElement>;
    public config!: typeof Config;

    run(config: typeof Config): void {
        this.config = config;

        this.app = new PIXI.Application<HTMLCanvasElement>({resizeTo : window});
        document.body.appendChild(this.app.view);

        this.loader = new Loader(this.config);
        this.loader.preload().then(() => this.start());

        this.scenes = new ScenesManager();
        this.app.stage.addChild(this.scenes.container);
    }

    start(): void {
        this.scenes.start("Game");
    }

    sprite(key: string): PIXI.Sprite {
        return new PIXI.Sprite(this.resources(key));
    }

    resources(key: string): any {
        return this.loader.resources[key];
    }
}

export const App = new Application();
