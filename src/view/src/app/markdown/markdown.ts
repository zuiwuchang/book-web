import * as showdown from 'showdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HtmlEncode } from './strings';
import * as $ from 'jquery';
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
function codeEncode(strs: Array<string>): string {
    for (let i = 0; i < strs.length; i++) {
        strs[i] = HtmlEncode(strs[i]);
    }
    return strs.join("\n<br>");
}
export class Markdown {
    HTML: SafeHtml = ''
    Header: Array<MarkdownHeader> = null;
    constructor(domSanitizer: DomSanitizer, book: string, chapter: string, markdown: string) {
        const headers = new Array<MarkdownHeader>();
        let autoID = 0;
        showdown.extension('custom-header-id', function () {
            var rgx = /^(#{1,6})[ \t]*(.+?) *[ \t]*#*$/gmi;
            return [{
                type: 'listener',
                listeners: {
                    'headers.before': function (event, text, converter, options, globals) {
                        text = text.replace(rgx, function (wm, hLevel, hText, hCustomId) {
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
                filter: function (html, converter, options) {
                    // 創建爲 document 元素
                    const liveHtml = $('<div></div>').html(html);
                    // 遍歷 table 增加 bootstrap 樣式
                    $('table', liveHtml).each(function () {
                        const table = $(this);
                        // table bootstrap classes
                        table.addClass('table table-striped table-bordered')
                            // make table responsive
                            .wrap('<div class="class table-responsive"></div>');
                    });
                    // 遍歷 a 標籤 修改 url 地址
                    $('a', liveHtml).each(function () {
                        const element = $(this);
                        const url = element.attr("href");
                        if (matchABS.test(url) || url[0] == "/") {
                            element.attr("target", "_blank");
                            return;
                        }
                        element.addClass("ng-router-a").attr("href", "view/" + url);
                    });
                    // 遍歷 img 標籤 修改 url 地址
                    $('img', liveHtml).each(function () {
                        const element = $(this);
                        element.addClass("max-fill-width");
                        const url = element.attr("src");
                        if (matchABS.test(url) || url[0] == "/") {
                            return;
                        }
                        element.attr("src", "/book/assets/" + book + "/" + chapter + "/" + url);
                    });
                    // 遍歷 code-view 爲 代碼增加 行號
                    $('pre', liveHtml).each(function () {
                        let codeName = null;
                        const element = $(this).find("code");
                        element.each(function () {
                            const code = $(this);
                            let codeStart = 1;
                            let strs = code.html().trim().split("\n");
                            strs = trimCodeItem(strs);
                            if (strs[0].startsWith("#info=") || strs[0].startsWith("//info=")) {
                                let str = strs[0];
                                if (str[0] == "#") {
                                    str = str.substring(6);
                                } else {
                                    str = str.substring(7);
                                }
                                strs = strs.splice(1);
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
                            const arrs = new Array(strs.length + 2);
                            if (codeStart == 1) {
                                arrs[0] = "<ol>";
                            } else {
                                arrs[0] = "<ol start='" + codeStart + "'>";
                            }
                            for (let i = 0; i < strs.length; i++) {
                                arrs[i + 1] = "<li>" + HtmlEncode(strs[i]) + "</li>";
                            }
                            arrs[strs.length + 1] = "</ol>";
                            code.html(arrs.join("\n"));
                        });
                        if (codeName != null) {
                            $(this).prepend($("<div class='hljs'></div>").text(codeName))
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
        const html = converter.makeHtml(markdown);
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
}
