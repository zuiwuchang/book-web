export class Xi18n {
    private keys: Object = new Object();
    constructor() {
    }
    init(doc: any) {
        if (!doc || !doc.childNodes || doc.childNodes.length == 0) {
            return;
        }
        for (let i = 0; i < doc.childNodes.length; i++) {
            const item = doc.childNodes[i];
            if (!item.attributes) {
                continue;
            }
            let key = item.attributes["data-key"];
            if (key == "" || key == undefined || key == null) {
                continue;
            }
            key = key.value;
            if (key == "" || key == undefined || key == null) {
                continue;
            }
            this.keys[key] = item.innerText;
        }
    }
    get(key: string) {
        if (!this.keys) {
            return key;
        }
        const val = this.keys[key];
        if (val == undefined) {
            return key;
        }
        return val;
    }
}
