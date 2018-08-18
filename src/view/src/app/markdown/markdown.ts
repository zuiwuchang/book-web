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
        showdown.extension('targetlink', function () {
            //const matchABS = /^(http\:\/\/)|(https\:\/\/)(\/)/i;
            const matchABS = /^([a-zA-Z]+)\:\/\//i;
            return [{
                type: 'lang',
                regex: /!?\[((?:\[[^\]]*]|[^\[\]])*)]\([ \t]*<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\4[ \t]*)?\)/g,
                replace: function (wholematch, linkText, url, a, b, title, c, target) {
                    let result;
                    if (wholematch[0] == "!") {
                        if (!matchABS.test(url) && url[0]!="/") {
                            url = "/book/assets/" + book + "/" + chapter + "/" + url;
                        }
                        if (typeof linkText != 'undefined' && linkText !== '' && linkText !== null) {
                            linkText = linkText.replace(/"/g, '&quot;');
                            result = '<img src="' + url + '" alt="' + linkText + '" style="max-width:100%;">';                            
                        } else {
                            result = '<img src="' + url + '" style="max-width:100%;">';
                        }
                    } else {
                        console.log(url,!matchABS.test(url))
                        if (!matchABS.test(url) && url[0]!="/") {
                            url = "view/" + url;
                        }

                        result = '<a href="' + url + '"';

                        if (typeof title != 'undefined' && title !== '' && title !== null) {
                            title = title.replace(/"/g, '&quot;');
                            title = showdown.helper.escapeCharacters(title, '*_', false);
                            result += ' title="' + title + '"';
                        }

                        if (typeof target != 'undefined' && target !== '' && target !== null) {
                            result += ' target="_blank"';
                        }

                        result += '>' + linkText + '</a>';
                       // console.log(result)
                    }
                    return result;
                }
            }];
        });
        const converter = new showdown.Converter({
            extensions: ['custom-header-id', 'targetlink'],
            parseImgDimensions: true,
        });
        const html = converter.makeHtml(markdown);
        if(domSanitizer){
            this.HTML = domSanitizer.bypassSecurityTrustHtml(html);
        }else{
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
