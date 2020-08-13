import { requireDynamic } from '../core/core/utils';
declare const MathJax: any
export function MathJaxQueue() {
    requireDynamic('MathJax').then(() => {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "MathJax"])
    }, (e) => {
        console.log(e)
    })
}