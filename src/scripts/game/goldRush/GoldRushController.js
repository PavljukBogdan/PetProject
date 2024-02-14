"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldRushController = void 0;
const Scene_1 = require("../../system/Scene");
const GoldRushSlotView_1 = require("./View/GoldRushSlotView");
const GoldRushModel_1 = require("./model/GoldRushModel");
const GoldRushBottomBarView_1 = require("./View/GoldRushBottomBarView");
const GoldRushWinPopupView_1 = require("./View/GoldRushWinPopupView");
class GoldRushController extends Scene_1.Scene {
    constructor() {
        super(...arguments);
        this.isAutoPlay = false;
    }
    create() {
        this.model = new GoldRushModel_1.GoldRushModel();
        this.slotView = new GoldRushSlotView_1.GoldRushSlotView(this.container, this.model);
        this.bottomBarView = new GoldRushBottomBarView_1.GoldRushBottomBarView(this.container, this.model);
        this.bottomBarView.setUserCoins(this.model.userCoins);
        this.bottomBarView.setCurrentBet(this.model.bet);
        this.bottomBarView.setSpinButtonEvent(this.startSpin.bind(this));
        this.bottomBarView.setAutoPlayEvent(this.autoPlay.bind(this));
        this.bottomBarView.setMaxBetEvent(this.changeBet.bind(this, this.model.maxBet - this.model.bet));
        this.bottomBarView.increaseCurrentBet(this.changeBet.bind(this, this.model.bet));
        this.bottomBarView.reduceCurrentBet(this.changeBet.bind(this, -this.model.bet));
    }
    autoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
    }
    startSpin() {
        this.bottomBarView.disableAllButtons();
        this.model.generateWinningResult();
        this.updateBalance();
        this.slotView.startMoveRows().then(this.handleGameResult.bind(this))
            .then(() => {
            if (this.isAutoPlay) {
                this.startSpin();
            }
            else {
                this.bottomBarView.enableAllButtons();
            }
        });
    }
    handleGameResult() {
        let self = this;
        let currentValue = this.model.userCoins;
        let coinsReward = this.model.coinsReward;
        let newValue = currentValue + coinsReward;
        let currentReward = this.model.currentReward;
        let hasValidReward = this.model.coinsWinLineTypes.indexOf(currentReward) !== -1;
        return new Promise(function (resolve) {
            if (hasValidReward) {
                self.model.userCoins = newValue;
                self.winPopup = new GoldRushWinPopupView_1.GoldRushWinPopupView(self.container);
                self.winPopup.showPopup(coinsReward, self.model.getRewardTypeText(currentReward)).then(() => {
                    resolve();
                    self.winPopup = null;
                });
                self.bottomBarView.userCoinsUpdate(newValue, currentValue);
            }
            else if (currentReward === 'freeGames') {
                self.bottomBarView.showFreeGame(Boolean(self.model.freeGame));
                resolve();
            }
            else {
                resolve();
            }
        });
    }
    updateBalance() {
        if (Boolean(this.model.freeGame)) {
            this.model.incrementFreeGame();
            this.bottomBarView.showFreeGame(Boolean(this.model.freeGame));
        }
        else {
            this.bottomBarView.showFreeGame(false);
            let currentValue = this.model.userCoins;
            let newValue = currentValue - this.model.bet;
            this.model.userCoins = newValue;
            this.bottomBarView.userCoinsUpdate(newValue, currentValue);
        }
    }
    changeBet(coins) {
        let bet = this.model.bet + coins;
        if (!this.model.checkBet(bet)) {
            return;
        }
        this.model.bet = bet;
        this.bottomBarView.setCurrentBet(bet);
    }
}
exports.GoldRushController = GoldRushController;
