import * as showdown from 'showdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as $ from 'jquery';
import { defer } from 'rxjs';
export class MarkdownHeader {
    ID: string = '';
    Text: string = '';
    LV: number = 0;
    constructor(id: string, lv: number) {
        this.ID = id;
        this.LV = lv;
    }
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
