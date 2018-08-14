import * as showdown from 'showdown';
const converter = new showdown.Converter();
export class Markdown {
    HTML:string = ''
    constructor(text:string){
        this.HTML = converter.makeHtml(text) ;
    }
}
