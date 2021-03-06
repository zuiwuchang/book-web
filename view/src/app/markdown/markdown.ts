import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
declare const $: any

export class MarkdownHeader {
    ID: string = '';
    Text: string = '';
    LV: number = 0;
    constructor(id: string, lv: number) {
        this.ID = id;
        this.LV = lv;
    }
}
const matchEmpty = /^\s$/
function trimCodeItem(strs: Array<string>): Array<string> {
    // left
    for (let i = 0; i < strs.length; i++) {
        const str = strs[i];
        if (str != "" && !matchEmpty.test(str)) {
            if (i != 0) {
                strs = strs.splice(i);
            }
            break;
        }
    }
    // right
    for (let i = strs.length - 1; i > -1; i--) {
        const str = strs[i];
        if (str != "" && !matchEmpty.test(str)) {
            if (i != 0) {
                strs = strs.splice(0, i + 1);
            }
            break;
        }
    }
    return strs
}
function spaceEncode(str: string): string {
    if (!str || str.length == 0) {
        return "";
    }
    str = str.replace(/ /g, "&nbsp;");
    str = str.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");
    return str;
};
function codeEncode(strs: Array<string>): string {
    for (let i = 0; i < strs.length; i++) {
        strs[i] = spaceEncode(strs[i]);
    }
    return strs.join("\n<br>");
}
function getController(str: string): string | null {
    str = str.trim()
    if (str.startsWith("#info=")) {
        str = str.substring(6).trim()
    } else if (str.startsWith("//info=")) {
        str = str.substring(7).trim()
    } else {
        return null
    }
    return str
}
export class Markdown {
    HTML: SafeHtml = ''
    HTMLS: Array<SafeHtml>
    Header: Array<MarkdownHeader> = null;
    constructor(showdown: any, domSanitizer: DomSanitizer, book: string, chapter: string, markdown: string,
        public readonly view?: boolean,
    ) {
        const headers = new Array<MarkdownHeader>();
        let autoID = 0;
        showdown.extension('custom-header-id', function () {
            var rgx = /^(#{1,6})[ \t]*(.+?) *[ \t]*#*$/gmi;
            return [{
                type: 'listener',
                listeners: {
                    'headers.before': function (event: any, text: any, converter: any, options: any, globals: any) {
                        text = text.replace(rgx, function (wm: any, hLevel: any, hText: any, hCustomId: any) {
                            // find how many # there are at the beginning of the header
                            // these will define the header level
                            hLevel = hLevel.length;

                            // since headers can have markdown in them (ex: # some *italic* header)
                            // we need to pass the text to the span parser
                            hText = showdown.subParser('spanGamut')(hText, options, globals);

                            // create the appropriate HTML
                            autoID++;
                            const id = "markdown-header-" + autoID;
                            const header = '<h' + hLevel + ' id="' + id + '">' + hText + '</h' + hLevel + '>';
                            headers.push(new MarkdownHeader(id, hLevel));
                            // hash block to prevent any further modification
                            return showdown.subParser('hashBlock')(header, options, globals);
                        });
                        // return the changed text
                        return text;
                    }
                },
            }];
        });
        // 加工 輸出
        showdown.extension('handle-output', function () {
            const matchABS = /^([a-zA-Z0-9]+)\:\/\//i;
            return [{
                type: "output",
                filter: function (html: any, converter: any, options: any) {
                    // 創建爲 document 元素
                    const liveHtml = $('<div></div>').html(html);
                    // 遍歷 table 增加 bootstrap 樣式
                    $('table', liveHtml).each(function (index: any, jq: any) {
                        const table = $(jq);
                        // table bootstrap classes
                        table.addClass('table table-striped table-bordered')
                            // make table responsive
                            .wrap('<div class="class table-responsive"></div>');
                    });
                    // 遍歷 a 標籤 修改 url 地址
                    $('a', liveHtml).each(function (index: any, jq: any) {
                        const element = $(jq);
                        const url = element.attr("href");
                        if (matchABS.test(url) || url[0] == "/") {
                            element.attr("target", "_blank");
                        } else if (url.startsWith("assets/")) {
                            element.addClass("ng-router-a").attr("href", "/book/assets/" + book + "/" + chapter + "/" + url);
                        } else {
                            element.addClass("ng-router-a").attr("href", "view/" + url);
                        }
                    });
                    // 遍歷 img 標籤 修改 url 地址
                    $('img', liveHtml).each(function (index: any, jq: any) {
                        const element = $(jq);
                        element.addClass("max-fill-width");
                        const url = element.attr("src");
                        if (matchABS.test(url) || url[0] == "/") {
                            return;
                        }
                        element.attr("src", "/book/assets/" + book + "/" + chapter + "/" + url);
                    });
                    // 遍歷 code-view 爲 代碼增加 行號
                    $('pre', liveHtml).each(function (index: any, jq: any) {
                        let codeName = null;
                        const element = $(jq).find("code");
                        element.each(function (index: any, jq: any) {
                            const code = $(jq);
                            let codeStart = 1;
                            let strs = code.html().trim().split("\n");
                            strs = trimCodeItem(strs);
                            let line = true
                            if (strs.length == 1) {
                                line = false
                            }
                            const ctrl = getController(strs[0])
                            if (ctrl != null) {
                                strs = strs.splice(1);
                                if (ctrl != "") {
                                    let str = ctrl
                                    try {
                                        const obj = JSON.parse(str);
                                        if (typeof obj == "string") {
                                            str = obj.trim();
                                            if (str != "") {
                                                codeName = str;
                                            }
                                        } else if (typeof obj == "number") {
                                            if (!isNaN(obj)) {
                                                let n = Math.floor(obj);
                                                if (n != 1) {
                                                    codeStart = n;
                                                }
                                            }
                                        } else if (typeof obj == "object") {
                                            if (typeof obj.name == "string") {
                                                str = obj.name.trim();
                                                if (str != "") {
                                                    codeName = str;
                                                }
                                            }
                                            if (typeof obj.noline == "boolean" && obj.noline) {
                                                strs = trimCodeItem(strs);
                                                code.html(codeEncode(strs));
                                                return;
                                            }
                                            if (typeof obj.line == "number" && !isNaN(obj.line)) {
                                                let n = Math.floor(obj.line);
                                                if (n != 1) {
                                                    codeStart = n;
                                                }
                                            }

                                        } else if (typeof obj == "boolean" && !obj) {
                                            strs = trimCodeItem(strs);
                                            code.html(codeEncode(strs));
                                            return;
                                        }
                                    } catch (e) {
                                        console.warn(str);
                                        console.warn(e);
                                    }
                                    strs = trimCodeItem(strs);
                                }
                            }
                            if (!line) {
                                code.html(codeEncode(strs));
                                return
                            }
                            const arrs = new Array(strs.length + 2);
                            if (codeStart == 1) {
                                arrs[0] = "<ol>";
                            } else {
                                arrs[0] = "<ol start='" + codeStart + "'>";
                            }
                            for (let i = 0; i < strs.length; i++) {
                                arrs[i + 1] = "<li>" + spaceEncode(strs[i]) + "</li>";
                            }
                            arrs[strs.length + 1] = "</ol>";
                            code.html(arrs.join("\n"));
                        });
                        if (codeName != null) {
                            $(jq).prepend($("<div class='hljs'></div>").text(codeName))
                        }
                    });
                    return liveHtml.html();
                }
            }];
        });
        const converter = new showdown.Converter({
            extensions: [
                'custom-header-id',
                'handle-output',
            ],
            parseImgDimensions: true,
            tables: true,
        });
        const html: string = converter.makeHtml(markdown);
        if (this.view) {
            const items = new Array<any>()
            let tmp = ''
            this._split(html).forEach((str) => {
                tmp += str
                if (tmp.length > 512) {
                    if (domSanitizer) {
                        items.push(domSanitizer.bypassSecurityTrustHtml(tmp))
                    } else {
                        items.push(tmp)
                    }
                    tmp = ''
                }
            })
            if (tmp.length != 0) {
                if (domSanitizer) {
                    items.push(domSanitizer.bypassSecurityTrustHtml(tmp))
                } else {
                    items.push(tmp)
                }
            }
            this.HTMLS = items
        }
        if (domSanitizer) {
            this.HTML = domSanitizer.bypassSecurityTrustHtml(html);
        } else {
            this.HTML = html;
        }
        if (headers.length > 0) {
            let div = document.createElement("div");
            div.innerHTML = html;
            for (let i = 0; i < headers.length; i++) {
                const element = headers[i];
                const id = element.ID;
                const doc = div.querySelector("#" + id);
                if (doc) {
                    element.Text = doc.textContent;
                }
            }
        }
        this.Header = headers;
    }
    private _split(str: string): Array<string> {
        const strs = new Array<string>()
        let h1, h2, h3, min
        while (true) {
            h1 = str.indexOf('</h1>')
            h2 = str.indexOf('</h2>')
            h3 = str.indexOf('</h3>')
            min = -1
            if (h1 >= 0) {
                min = h1
            }
            if (h2 >= 0) {
                if (min < 0) {
                    min = h2
                } else if (h2 < min) {
                    min = h2
                }
            }
            if (h3 >= 0) {
                if (min < 0) {
                    min = h3
                } else if (h3 < min) {
                    min = h3
                }
            }

            if (min < 0) {
                if (str.length > 0) {
                    strs.push(str)
                }
                break
            }
            strs.push(str.substring(0, min + 5))
            str = str.substring(min + 5)
        }
        return strs
    }
}
