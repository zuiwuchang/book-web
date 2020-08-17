export function HtmlEncode(str: string): string {
    if (!str || str.length == 0) {
        return "";
    }
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/ /g, "&nbsp;");
    str = str.replace(/\'/g, "&#39;");
    str = str.replace(/\"/g, "&quot;");
    return str;
};
export function HtmlDecode(str: string): string {
    if (!str || str.length == 0) {
        return "";
    }
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/&#39;/g, "\'");
    str = str.replace(/&quot;/g, "\"");
    return str;
};
export class Strings {
    private constructor() { }
    private static items: Array<any>

    private static getItems(): Array<any> {
        if (!Strings.items) {
            Strings.items = [
                "\\", "`", "*", "_",
                "{", "}", "[", "]", "(", ")",
                "#", "+", "-", ".", "!",
            ].map(function (element) {
                return {
                    escape: new RegExp("\\" + element, "g"),
                    escapeVal: "\\" + element,
                    unescape: new RegExp("\\\\\\" + element, "g"),
                    unescapeVal: element,
                }
            })
        }
        return Strings.items
    }

    // 爲 markdown 中的 轉義字符 添加 上 \
    static escape(src: string): string {
        if (typeof src != "string") {
            return src;
        }
        const items = Strings.getItems()
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            src = src.replace(item.escape, item.escapeVal);
        }
        return HtmlEncode(src);
    }
    static unescape(src: string): string {
        if (typeof src != "string") {
            return src;
        }
        const items = Strings.getItems()
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            src = src.replace(item.unescape, item.unescapeVal);
        }
        return HtmlDecode(src);
    }
}
