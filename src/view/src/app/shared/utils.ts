import * as showdown from 'showdown';
const matchH1 = /^#{1}[ \t]/;
const matchH2 = /^#{2}[ \t]/;
const matchH3 = /^#{3}[ \t]/;
const matchH4 = /^#{4}[ \t]/;
const matchH5 = /^#{5}[ \t]/;
const matchH6 = /^#{6}/;
const matchSetextH1 = /^[=]+[ \t]*/;
const matchSetextH2 = /^[-]+[ \t]*/;
export class Utils {
    static MakeHtml(markdown: string): string {
        const header = [];
        showdown.extension('custom-header-id', function () {
            //let rgx = /(#{1,6})([^\n])*(?:\r|\n)*/g;
            const rgx = /([\n]#{1,6})([\n]#{1,6})([^\n])*(?:\r|\n)/g;
            return [{
                type: 'listener',
                listeners: {
                    'headers.before': function (event, text, converter, options, globals) {
                        const arrs = text.split("\n");
                        let pre = -2;
                        for (let i = 0; i < arrs.length; i++) {
                            const ele = arrs[i];
                            if (matchH1.test(ele)) {
                                pre = i;
                                header.push({
                                    Tag: "h1",
                                    Name: ele,
                                });
                            } else if (matchSetextH1.test(ele)) {
                                if (i != 0 && pre + 1 != i) {
                                    pre = i;
                                    header.push({
                                        Tag: "h1",
                                        Name: arrs[i - 1],
                                    });
                                }
                            } else if (matchH2.test(ele)) {
                                
                                pre = i;
                                header.push({
                                    Tag: "h2",
                                    Name: ele,
                                });

                            } else if (matchSetextH2.test(ele)) {
                                if (i != 0 && pre + 1 != i) {
                                    pre = i;
                                    header.push({
                                        Tag: "h2",
                                        Name: arrs[i - 1],
                                    });
                                }
                            } else if (matchH3.test(ele)) {
                                pre = i;
                                header.push({
                                    Tag: "h3",
                                    Name: ele,
                                });
                            } else if (matchH4.test(ele)) {
                                pre = i;
                                header.push({
                                    Tag: "h4",
                                    Name: ele,
                                });
                            } else if (matchH5.test(ele)) {
                                pre = i;
                                header.push({
                                    Tag: "h5",
                                    Name: ele,
                                });
                            } else if (matchH6.test(ele)) {
                                pre = i;
                                header.push({
                                    Tag: "h6",
                                    Name: ele,
                                });
                            }
                        }
                        return text;
                    }
                }
            }];
        });
        const converter = new showdown.Converter();
        converter.addExtension("custom-header-id")
        const rs = converter.makeHtml(markdown);
        console.log(header)
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
