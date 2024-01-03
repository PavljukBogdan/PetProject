import {Scene} from "../../system/Scene";
import {GoldRushSlotView} from "./View/GoldRushSlotView";
import {GoldRushModel} from "./model/GoldRushModel";
import {GoldRushBottomBarView} from "./View/GoldRushBottomBarView";

export class GoldRushController extends Scene {
    private model!: GoldRushModel;
    private slotView!: GoldRushSlotView;
    private bottomBarView!: GoldRushBottomBarView;
    create() {
        this.model = new GoldRushModel();
        this.slotView = new GoldRushSlotView(this.container, this.model);
        this.bottomBarView = new GoldRushBottomBarView(this.container, this.model);


        this.bottomBarView.setSpinButton(this.startSpin.bind(this));

    }

    private startSpin(): void {
        this.bottomBarView.disableSpinButton();
        this.model.wineLine();
        let result = this.slotView.startMoveRows();
        Promise.all(result).then(()=> {this.bottomBarView.enableSpinButton();});
    }
}
