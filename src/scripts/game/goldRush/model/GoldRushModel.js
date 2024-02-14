"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldRushModel = void 0;
class GoldRushModel {
    constructor() {
        this.icons = ['snake', 'boots', 'dynamite', 'gold', 'coins', 'barrels', 'trolley'];
        this.lineTypes = ['nothing', 'bigWin', 'nothing', 'jackpot', 'nothing', 'freeGames', 'nothing', 'bonus', 'nothing'];
        //private lineTypes: string[] = ['bigWin','jackpot','freeGames', 'bonus'];
        this._coinsWinLineTypes = ['bigWin', 'jackpot', 'bonus'];
        this.topLineIndex = [4, 4, 4, 4, 4];
        this.middleLineIndex = [5, 5, 5, 5, 5];
        this.bottomLineIndex = [6, 6, 6, 6, 6];
        this.defaultLineIndex = [0, 1, 2, 3, 4];
        this.lineV = [4, 5, 6, 5, 4];
        this._userCoins = 20000000;
        this._bet = 100;
        this.minBet = 100;
        this._maxBet = 1000;
        this._coinsReward = 0;
        this._freeGames = 0;
    }
    getIcons() {
        let icons = this.icons.slice(0);
        this.shuffleArray(icons);
        return icons;
    }
    generateWinningResult() {
        this._currentReward = this.lineTypes[Math.round(Math.random() * this.lineTypes.length)];
        this._coinsReward = 0;
        console.log(this._currentReward);
        switch (this._currentReward) {
            case 'bigWin':
                this._coinsReward = this._bet * 100;
                this._wineLineResult =
                    {
                        winType: this._currentReward,
                        icon: this.icons[6],
                        line: this.lineV
                    };
                break;
            case 'jackpot':
                this._coinsReward = this._bet * 10;
                this._wineLineResult =
                    {
                        winType: this._currentReward,
                        icon: this.icons[3],
                        line: this.middleLineIndex
                    };
                break;
            case 'freeGames':
                this._freeGames += 10;
                this._wineLineResult =
                    {
                        winType: this._currentReward,
                        icon: this.icons[2],
                        line: this.bottomLineIndex
                    };
                break;
            case 'bonus':
                this._coinsReward = 1000;
                this._wineLineResult =
                    {
                        winType: this._currentReward,
                        icon: this.icons[4],
                        line: this.topLineIndex
                    };
                break;
            case 'nothing':
                this._wineLineResult =
                    {
                        winType: this._currentReward,
                        icon: this.icons[0],
                        line: this.defaultLineIndex
                    };
                break;
        }
    }
    getRewardTypeText(rewardType) {
        let text = '';
        switch (rewardType) {
            case 'bigWin':
                text = 'BIG WIN';
                break;
            case 'jackpot':
                text = 'BIG WIN';
                break;
            case 'bonus':
                text = 'BONUS';
                break;
        }
        return text;
    }
    get coinsReward() {
        return this._coinsReward;
    }
    incrementFreeGame() {
        this._freeGames--;
    }
    get freeGame() {
        return this._freeGames;
    }
    get currentReward() {
        return this._currentReward;
    }
    get coinsWinLineTypes() {
        return this._coinsWinLineTypes;
    }
    get wineLineResult() {
        return this._wineLineResult;
    }
    set userCoins(coins) {
        this._userCoins = coins;
    }
    get userCoins() {
        return this._userCoins;
    }
    set bet(bet) {
        this._bet = bet;
    }
    get bet() {
        return this._bet;
    }
    get maxBet() {
        return this._maxBet;
    }
    checkBet(bet) {
        return !(bet < this.minBet || bet > this._maxBet);
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
exports.GoldRushModel = GoldRushModel;
_a = GoldRushModel;
GoldRushModel.soundsPath = 'assets/sounds/';
GoldRushModel.SoundsNameSpace = {
    bkg: _a.soundsPath + 'bkgSound.mp3',
    reels: _a.soundsPath + 'reelSound.mp3',
    click: _a.soundsPath + 'clickButton.mp3'
};
GoldRushModel.SlotWindowSize = {
    width: 1920,
    height: 1080
};
