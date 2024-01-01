import {Tools, FileData} from "../system/Tools";
import {Game} from "./Game";
import {Scene} from "../system/Scene";

export interface Scenes {
    [key: string]: typeof Scene;
}

export const Config: { scenes: Scenes, loader: FileData[] } = {
    scenes: {
        Game
    },
    loader: Tools.massiveRequire(require.context('./../../assets/', true, /\.(mp3|png|jpe?g)$/))
}

