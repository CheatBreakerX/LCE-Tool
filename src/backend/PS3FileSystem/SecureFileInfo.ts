export class SecureFileInfo {
    constructor(name: string, id: string, secureFileID: string, discHashKey: string, isProtected: boolean) {
        this.name = name;
        this.gameIDs = id.split('/');
        this.secureFileID = secureFileID;
        this.discHashKey = discHashKey;
        this.isProtected = isProtected;
    }

    name: string;
    gameIDs: string[];
    secureFileID: string;
    discHashKey: string;
    isProtected: boolean;
}