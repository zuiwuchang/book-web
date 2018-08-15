import * as showdown from 'showdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
    constructor(domSanitizer: DomSanitizer, markdown: string) {
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
        const converter = new showdown.Converter();
        converter.addExtension("custom-header-id")
        const html = converter.makeHtml(markdown);
        this.HTML = domSanitizer.bypassSecurityTrustHtml(html);
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
