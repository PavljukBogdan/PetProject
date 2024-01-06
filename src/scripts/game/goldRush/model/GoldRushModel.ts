

export class GoldRushModel {
    private icons: string[] = ['snake','boots','dynamite','gold','coins','barrels','trolley'];
    private lineTypes: string[] = ['nothing','bigWin','nothing','jackpot','nothing','freeGames','nothing', 'bonus','nothing'];
    private topLineIndex: number[] = [4, 4, 4, 4, 4];
    private middleLineIndex: number[] = [5, 5, 5, 5, 5];
    private bottomLineIndex: number[] = [6, 6, 6, 6, 6];
    private defaultLineIndex: number[] = [0, 1, 2, 3, 4];
    private lineV: number[] = [4, 5, 6, 5, 4];
    private wineLineResult!: WineLineResult;
    private lineType!: string;
    private userCoins: number = 20000000;
    private bet: number = 100;
    private minBet: number = 100;
    private maxBet: number = 1000;

    public getIcons(): string[] {
        let icons = this.icons.slice(0);
        this.shuffleArray(icons)
        return icons;
    }

    public getSlotWindowSize(): {width: number, height: number} {
        return {width: 1920, height: 1080};
    }

    public wineLine(): void {
        this.lineType = this.lineTypes[Math.round(Math.random() * this.lineTypes.length)];
        console.log(this.lineType);
        switch (this.lineType) {
            case 'bigWin':
                this.wineLineResult =
                    {
                        icon: this.icons[6],
                        line: this.lineV
                    };
                break;
            case 'jackpot':
                this.wineLineResult =
                    {
                        icon: this.icons[3],
                        line: this.middleLineIndex
                    };
                break;
            case 'freeGames':
                this.wineLineResult =
                    {
                        icon: this.icons[2],
                        line: this.bottomLineIndex
                    };
                break;
            case 'bonus':
                this.wineLineResult =
                    {
                        icon: this.icons[4],
                        line: this.topLineIndex
                    };
                break;
            case 'nothing':
                this.wineLineResult =
                    {
                        icon: this.icons[0],
                        line: this.defaultLineIndex
                    };
                break;
        }
        console.log(this.wineLineResult);
    }

    public getWineLine(): WineLineResult {
        return this.wineLineResult;
    }

    public getUserCoins(): number {
        return this.userCoins;
    }

    public setCurrentBet(coins: number): void {
        this.bet = coins;
    }

    public getCurrentBet(): number {
        return this.bet;
    }

    public checkBet(bet: number): boolean {
        return !(bet < this.minBet || bet > this.maxBet);

    }

    private shuffleArray(array: any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

interface WineLineResult {
    icon: string,
    line: number[]
}
