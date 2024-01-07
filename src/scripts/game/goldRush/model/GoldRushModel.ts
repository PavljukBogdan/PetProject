

export class GoldRushModel {
    private icons: string[] = ['snake','boots','dynamite','gold','coins','barrels','trolley'];
    private lineTypes: string[] = ['nothing','bigWin','nothing','jackpot','nothing','freeGames','nothing', 'bonus','nothing'];
    //private lineTypes: string[] = ['bigWin','jackpot','freeGames', 'bonus'];
    private _coinsWinLineTypes = ['bigWin','jackpot', 'bonus'];

    private topLineIndex: number[] = [4, 4, 4, 4, 4];
    private middleLineIndex: number[] = [5, 5, 5, 5, 5];
    private bottomLineIndex: number[] = [6, 6, 6, 6, 6];
    private defaultLineIndex: number[] = [0, 1, 2, 3, 4];
    private lineV: number[] = [4, 5, 6, 5, 4];
    private _wineLineResult!: WineLineResult;
    private _currentReward!: string;
    private _userCoins: number = 20000000;
    private _bet: number = 100;
    private minBet: number = 100;
    private _maxBet: number = 1000;
    private _coinsReward: number = 0;
    private _freeGames: number = 0;

    public getIcons(): string[] {
        let icons = this.icons.slice(0);
        this.shuffleArray(icons)
        return icons;
    }

    get slotWindowSize(): {width: number, height: number} {
        return {width: 1920, height: 1080};
    }
    public generateWinningResult(): void {
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
        console.log(this._wineLineResult);
    }

    get coinsReward(): number {
        return this._coinsReward;
    }

    public incrementFreeGame(): void {
        this._freeGames--;
    }

    get freeGame(): number {
        return this._freeGames;
    }

    get currentReward(): string {
        return this._currentReward;
    }

    get coinsWinLineTypes(): string[] {
        return this._coinsWinLineTypes;
    }

    get wineLineResult(): WineLineResult {
        return this._wineLineResult;
    }

    set userCoins(coins: number) {
        this._userCoins = coins;
    }

    get userCoins(): number {
        return this._userCoins;
    }

    set bet(bet: number) {
        this._bet = bet;
    }

    get bet(): number {
        return this._bet;
    }

    get maxBet(): number {
        return this._maxBet;
    }

    public checkBet(bet: number): boolean {
        return !(bet < this.minBet || bet > this._maxBet);

    }

    private shuffleArray(array: any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

interface WineLineResult {
    winType: string,
    icon: string,
    line: number[]
}
