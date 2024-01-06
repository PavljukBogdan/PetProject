import {Scene} from "../../system/Scene";
import {GoldRushSlotView} from "./View/GoldRushSlotView";
import {GoldRushModel} from "./model/GoldRushModel";
import {GoldRushBottomBarView} from "./View/GoldRushBottomBarView";

export class GoldRushController extends Scene {
    private model!: GoldRushModel;
    private slotView!: GoldRushSlotView;
    private bottomBarView!: GoldRushBottomBarView;
    private isAutoPlay: boolean = false;
    create() {
        this.model = new GoldRushModel();
        this.slotView = new GoldRushSlotView(this.container, this.model);
        this.bottomBarView = new GoldRushBottomBarView(this.container, this.model);
        this.bottomBarView.setUserCoins(this.model.getUserCoins());
        this.bottomBarView.setCurrentBet(this.model.getCurrentBet());



        this.bottomBarView.setSpinButtonEvent(this.startSpin.bind(this));
        this.bottomBarView.setAutoPlayEvent(this.autoPlay.bind(this));
        this.bottomBarView.increaseCurrentBet(this.changeBet.bind(this, this.model.getCurrentBet()));
        this.bottomBarView.reduceCurrentBet(this.changeBet.bind(this, -this.model.getCurrentBet()));
    }

    private autoPlay(): void {
        this.isAutoPlay = !this.isAutoPlay;
    }

    private startSpin(): void {
        this.bottomBarView.disableSpinButton();
        this.model.wineLine();
        let result = this.slotView.startMoveRows();
        Promise.all(result).then(()=> {
            if (this.isAutoPlay) {
                this.startSpin();
            } else {
                this.bottomBarView.enableSpinButton();
            }
        });
    }

    private changeBet(coins: number) {
        let bet: number = this.model.getCurrentBet() + coins;
        if (!this.model.checkBet(bet)) {
            return;
        }
        this.model.setCurrentBet(bet);
        this.bottomBarView.setCurrentBet(bet);
    }
}
