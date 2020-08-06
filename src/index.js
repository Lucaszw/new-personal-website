import './scss/main.scss';

import { el, mount } from "redom";
import { scrollIntoView } from 'scroll-js';
import * as _ from 'lodash';

import {initTitleAnimation, mountTitle} from './page1.js';
import {ProjectsDisplay} from './page2.js';

let titleAnimation;

// Pages
const pg1 = el("div", {id: "page1", class: "page"});
const pg2 = el("div", {id: "page2", class: "page"});
const pg3 = el("div", {id: "page3", class: "page"});

// pg3.appendChild(project1)
mount(document.body, pg1);
mount(document.body, pg2);
mount(document.body, pg3);

// Info
const pageInfo = el("div", {id: "page-info"});
mount(document.body, pageInfo);

// Disable Scroll
class Scroll {
    constructor() {
        this.pages = [pg1, pg2, pg3];
        this.pages.currentIndex = 0;
        pg1.onView = this.page1Viewed;
        pg2.onView = this.page2Viewed;
        pg3.onView = this.page3Viewed;
        this.scrollTime = 200;
        this._scrolling = false;
        this.trackDirection();
    }
    page1Viewed() {
        titleAnimation.play();
    }
    page2Viewed() {
    }
    page3Viewed() {

    }
    trackDirection() {
        let scrollFcn = _.debounce((e) => {
            if (e.deltaY < 0) {
                this.scrollToPage(this.getPrevIndex());
            } else {
                this.scrollToPage(this.getNextIndex());
            }
        }, 50, {leading: true, trailing: false});
        document.body.addEventListener('wheel', (e) => {
            e.preventDefault();
            // if (this._scrolling) return;
            scrollFcn(e);
        }, {passive:false});
    }
    getPrevIndex() {
        let index = this.pages.currentIndex;
        if (index - 1 < 0) {
            return index;
        } else {
            return index - 1
        }
    }
    getNextIndex() {
        let index = this.pages.currentIndex;
        if (index + 1 >= this.pages.length) {
            return index;
        } else {
            return index + 1;
        }
    }
    async scrollToPage(pageIndex) {
        const page = this.pages[pageIndex];
        this.pages.currentIndex = pageIndex;
        this._scrolling = true;
        scrollIntoView(page, {easing: 'ease-in-out', duration: 500});
        this._scrolling = false;
        page.onView();
    }
}

setTimeout( () => {
    window.scroll = new Scroll();
    scroll.scrollToPage(0);
}, 0);

mountTitle(pg1);
titleAnimation = initTitleAnimation();
new ProjectsDisplay(pg2,200,150);