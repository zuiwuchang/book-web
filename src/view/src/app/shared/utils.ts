import * as showdown from 'showdown';
export class Utils {
    static MakeHtml(markdown: string): string {
        showdown.extension('custom-header-id', function () {
            //let rgx = /(#{1,6})([^\n])*(?:\r|\n)*/g;
            const rgx = /([\n]#{1,6})([\n]#{1,6})([^\n])*(?:\r|\n)/g;
            return [{
                type: 'listener',
                listeners: {
                    'headers.before': function (event, text, converter, options, globals) {
                        const arrs = text.split("\n");
                        console.log(arrs);

                        return text;
                    }
                }
            }];
        });
        const converter = new showdown.Converter();
        converter.addExtension("custom-header-id")
        const rs = converter.makeHtml(markdown);
        return rs
    }
    static ResolveError(e): string {
        if (!e) {
            return "nil"
        }
        if (e.error) {
            return e.error.description;
        } else if (e.message) {
            return e.message;
        }
        return "unknow";
    }
}
