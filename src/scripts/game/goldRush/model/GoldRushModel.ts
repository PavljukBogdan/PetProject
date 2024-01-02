

export class GoldRushModel {
    private icons: string[] = ['snake','boots','dynamite','gold','coins','barrels','trolley'];

    public getIcons(): string[] {
        this.shuffleArray(this.icons);
        return this.icons;
    }

    private shuffleArray(array: any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
