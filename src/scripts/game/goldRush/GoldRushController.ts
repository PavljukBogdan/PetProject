import {Scene} from "../../system/Scene";
import {GoldRushSlotView} from "./View/GoldRushSlotView";
import {GoldRushModel} from "./model/GoldRushModel";

export class GoldRushController extends Scene {
    private model!: GoldRushModel;
    private slotView!: GoldRushSlotView;
    create() {
        this.model = new GoldRushModel();
        this.slotView = new GoldRushSlotView(this.container, this.model);
        console.log(this)
    }
}
