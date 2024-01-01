type RequireContext = {
    keys: () => string[];
    <T>(key: string): T;
};
export type FileData = {
    key: string;
    data: any;
};
export class Tools {
    static massiveRequire(req : RequireContext): FileData[] {
        const files: any[] = [];
        req.keys().forEach((key: any) => {
            files.push(({
                key: key,
                data: req(key)
            }))
        });
        return files;
    }
}
