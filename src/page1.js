import anime from 'animejs/lib/anime.es.js';
import { el, mount } from "redom";

let mountTitle = (page) => {
    let title = el("h1.ml5", el("span.text-wrapper", [
        el("span.line.line1"),
        el("span.letters.letters-left",{},"ZEER"),
        el("span.letters.ampersand",{},"."),
        el("span.letters.letters-right",{},"IO"),
        el("span.line.line2",{})
    ]));
    mount(page, title);
}
let initTitleAnimation =  () => {
    return anime.timeline({loop: false})
    .add({
    targets: '.ml5 .line',
    opacity: [0.5,1],
    scaleX: [0, 1],
    easing: "easeInOutExpo",
    duration: 700
    }).add({
    targets: '.ml5 .line',
    duration: 600,
    easing: "easeOutExpo",
    translateY: (el, i) => (-0.625 + 0.625*2*i) + "em"
    }).add({
    targets: '.ml5 .ampersand',
    opacity: [0,1],
    scaleY: [0.5, 1],
    easing: "easeOutExpo",
    duration: 600
    }, '-=600').add({
    targets: '.ml5 .letters-left',
    opacity: [0,1],
    translateX: ["0.5em", 0],
    easing: "easeOutExpo",
    duration: 600
    }, '-=300').add({
    targets: '.ml5 .letters-right',
    opacity: [0,1],
    translateX: ["-0.5em", 0],
    easing: "easeOutExpo",
    duration: 600
    }, '-=600');
};

export {initTitleAnimation, mountTitle};