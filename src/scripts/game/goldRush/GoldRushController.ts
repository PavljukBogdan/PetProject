import {Scene} from "../../system/Scene";
import {GoldRushSlotView} from "./View/GoldRushSlotView";
import {GoldRushModel} from "./model/GoldRushModel";
import {GoldRushBottomBarView} from "./View/GoldRushBottomBarView";
import * as buffer from "buffer";

export class GoldRushController extends Scene {
    private model!: GoldRushModel;
    private slotView!: GoldRushSlotView;
    private bottomBarView!: GoldRushBottomBarView;
    private isAutoPlay: boolean = false;
    create() {
        this.model = new GoldRushModel();
        this.slotView = new GoldRushSlotView(this.container, this.model);
        this.bottomBarView = new GoldRushBottomBarView(this.container, this.model);

        this.bottomBarView.setUserCoins(this.model.userCoins);
        this.bottomBarView.setCurrentBet(this.model.bet);
        this.bottomBarView.setSpinButtonEvent(this.startSpin.bind(this));
        this.bottomBarView.setAutoPlayEvent(this.autoPlay.bind(this));
        this.bottomBarView.setMaxBetEvent(this.changeBet.bind(this, this.model.maxBet - this.model.bet))
        this.bottomBarView.increaseCurrentBet(this.changeBet.bind(this, this.model.bet));
        this.bottomBarView.reduceCurrentBet(this.changeBet.bind(this, -this.model.bet));
    }

    private autoPlay(): void {
        this.isAutoPlay = !this.isAutoPlay;
    }

    private startSpin(): void {
        this.bottomBarView.disableSpinButton();
        this.model.generateWinningResult();
        this.updateBalance();

        this.slotView.startMoveRows().then(this.checkReward.bind(this))
            .then(()=> {
            if (this.isAutoPlay) {
                this.startSpin();
            } else {
                this.bottomBarView.enableSpinButton();
            }
        });
    }

    private checkReward(): Promise<void> {
        let self = this;
        let currentValue: number = this.model.userCoins;
        let newValue: number = currentValue + this.model.coinsReward;
        let check: boolean = this.model.coinsWinLineTypes.indexOf(this.model.currentReward) !== -1;
        return new Promise(function (resolve) {
            if (check) {
                self.model.userCoins = newValue;
                self.bottomBarView.userCoinsUpdate(newValue, currentValue).then(resolve);
            } else if(self.model.currentReward === 'freeGames') {
                self.bottomBarView.showFreeGame(Boolean(self.model.freeGame));
                resolve();
            } else {
                resolve();
            }
        });
    }

    private updateBalance(): void {
        if (Boolean(this.model.freeGame)) {
            this.model.incrementFreeGame();
            this.bottomBarView.showFreeGame(Boolean(this.model.freeGame));
        } else {
            this.bottomBarView.showFreeGame(false);
            let currentValue = this.model.userCoins;
            let newValue = currentValue - this.model.bet;
            this.model.userCoins = newValue;
            this.bottomBarView.userCoinsUpdate(newValue, currentValue);
        }
    }

    private changeBet(coins: number) {
        let bet: number = this.model.bet + coins;
        if (!this.model.checkBet(bet)) {
            return;
        }
        this.model.bet = bet;
        this.bottomBarView.setCurrentBet(bet);
    }
}
