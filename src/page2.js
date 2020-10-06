import { el, mount } from "redom";
import * as _ from 'lodash';
import Timeout from 'await-timeout';
import anime from 'animejs/lib/anime.es.js';
import html2canvas from 'html2canvas';
import randomInt from 'random-int';

import {projects} from './projects/projects.js';


class ProjectsDisplay {
    constructor(page, width, height) {
        this.projects = projects;
        this.page = page;
        this.width = width;
        this.height = height;
        this.animatingRotation = false;
        this.listenToPageResize();
        this.fillPageWithSquares();
        for (let project of this.projects) {
            console.log({project});
            if (project.html)
                this.page.appendChild(project.html);
        }
    }
    listenToPageResize() {
        window.addEventListener("resize", _.debounce(this.fillPageWithSquares.bind(this), 250, {leading: false, trailing: true})); 
    }
    fillPageWithSquares() {
        let squares = this.page.querySelectorAll(".square");
        console.log({squares});
        for (let s of squares) {
            console.log({s});
            s.remove();
        }
        let bbox = this.page.getBoundingClientRect();

        let cols = Math.floor(bbox.width/this.width);
        let rows = Math.floor(bbox.height/this.height);
        // Ensure odd amount of columns and rows
        cols += !(cols % 2);
        rows += !(rows % 2);

        let middleRow = Math.floor(rows/2);
        let middleCol = Math.floor(cols/2);

        let remainingWidth = bbox.width - cols*this.width;
        let remainingHeight = bbox.height - rows*this.height;

        let width = this.width + remainingWidth/cols;
        let height = this.height + remainingHeight/rows;


        // Randomly reserve spots for projects within matrix
        let projectPlace = {};
        _.set(projectPlace, `[${middleRow}][${middleCol}]`, 1);
        for (let project of this.projects) {
            console.log("placing: ", project);
            let row = middleRow;
            let col = middleCol;
            console.log(row, col);
            while (_.get(projectPlace, `[${row}][${col}]`)) {
                col = randomInt(0, cols-1);
                row = randomInt(0, rows-1);
            }
            _.set(projectPlace, `[${row}][${col}]`, project);
            // console.log("FOUND: ", row, col);
        }
        console.log("FINISHED...");
        // console.log({projectPlace});

        // Draw each square
        for (let row = 0; row < rows; row ++) {
            for (let col = 0; col < cols; col ++) {
                let top = height * row;
                let left = width * col;
                let isMiddle = (row == middleRow) && (col == middleCol);

                let square = this.drawSquare(top,left, width, height, isMiddle);
                square.id = `s_${row}_${col}`;
                square.r = row;
                square.c = col;
                square.width = width;
                square.height = height;

                // Draw an image in squares with a project
                if (_.get(projectPlace, `[${row}][${col}]`) && !isMiddle) {
                    square.project = projectPlace[row][col];
                    square.querySelector(".front").style.backgroundImage = `url(${square.project.icon})`;
                }
            }
        }
    }
    drawSquare(top,left,width,height,isMiddle=false) {
        // project1Icon
        const square = el('.square', [el("div.front"), el("canvas.back")]);
        square.style.width = width + "px";
        square.style.height = height + "px";
        square.style.top = top + "px";
        square.style.left = left + "px";
        square.isMiddle = isMiddle;
        mount(this.page, square);

        if (isMiddle == true) {
            // square.style.background = '#676172';
            square.querySelector(".front").innerHTML = "<b class='projects-title'>PROJECTS</b>";
            square.classList.add("projects-title");
            // square.style.zIndex = "2000";
        }
        square.onmouseover = this.onMouseOverSquare.bind(this, square);
        square.onmouseout = this.onMouseOutOfSquare.bind(this, square);
        square.onclick = this.onClickSquare.bind(this, square);
        return square;
    }
    getNeighbours(square, visit = false) {
        let [,r,c] = square.id.split("_");
        r = parseInt(r);
        c = parseInt(c);
        let neighbours = [];
        for (let row = r-1; row <= r+1; row++) {
            for (let col = c-1; col <= c+1; col++) {
                let neighbour = document.querySelector(`#s_${row}_${col}`);
                if (neighbour) {
                    if (visit == true && !neighbour.visited) {
                        neighbour.visited = true;
                        neighbours.push(neighbour);
                    } else if (visit == false) {
                        neighbours.push(neighbour);
                    }
                }
            }
        }
        return neighbours;
    }
    async onClickSquare(square) {
        if (this.animatingRotation == true) return;
        for (let s of this.page.querySelectorAll(".square"))
            s.visited = false;
        square.visited = true;
        let steps = [];
        let nextStep = [square];

        while (nextStep.length > 0) {
            steps.push(nextStep);
            nextStep = [];
            for (let s of _.last(steps)) {
                nextStep = [...nextStep, ...this.getNeighbours(s, true)];
            }
        }
        this.animatingRotation = true;

        if (square.focused == false)
            await this.onMouseOverSquare(square, null, true);
        
        if (square.project && square.side != 'back')
            await this.turnOverAllSquares(steps, square.project);
        else if (square.side == 'back')
        await this.turnOverAllSquares(steps);
        this.animatingRotation = false;
    }
    paintSquare(square, imgData) {
        const dpr = window.devicePixelRatio || 1;
        let {c,r,width,height} = square;
        let canvas = square.querySelector(`.${square.side}`);
        // let {width, height} = canvas.getBoundingClientRect();
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        let ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, -c*width*dpr,-r*height*dpr);
    }
    async turnOverSquare(square, imgData) {
        let rotation;
        if (square.side != "back") {
            square.side = "back";
            rotation = 180;
            this.paintSquare(square, imgData);
        } else {
            square.side = "front";
            rotation = 0;
        }

        return await anime.timeline({loop: false})
        .add({
            targets: square,
            rotateY: rotation,
            easing: 'easeInOutSine',
            duration: 400
        }).finished
    }
    async turnOverAllSquares(steps, project) {
        let imgData;
        if (project) {
            const imgContext = (await this.takeSnapshot(project.html)).getContext('2d');
            imgData = imgContext.getImageData(0,0,window.innerWidth*10,window.innerHeight*10);    
        }

        // imgContext.putImageData(imgData,0,0);
        for (let step of steps) {
            for (let square of step) {
                // if (!square.isMiddle) {
                this.turnOverSquare(square,imgData);
                // }
            }
            await Timeout.set(100);
        }
    }
    async onMouseOverSquare(square, e, skipAnimationCheck = false) {
        square.mouseOver = true;
        square.focused = false;
        if ((this.animatingRotation == true) && (skipAnimationCheck == false)) {
            // square.style.background = "rgb(117, 110, 129)";
            return;
        }
        // square.style.background = "rgb(144, 136, 159)";
        square.style.zIndex = "1000";
        square.style.boxShadow = "black 0px 2px 8px";
        square.cancelAnimation = false;
        await anime.timeline({loop: false, update: async function (anim) {
            if (!square.cancelAnimation) return;
                anim.pause();
                await anime.timeline({loop: false}).add({
                    targets: [square],
                    scaleX: 1,
                    scaleY: 1,
                    easing: "easeOutExpo",
                    duration: 0
                }).finished;
            }
        }).add({
            targets: [square],
            scaleX: [1, 1.03],
            scaleY: [1, 1.03],
            easing: "easeOutExpo",
            duration: 300
        }).finished;
        square.focused = true;
    }
    async onMouseOutOfSquare(square) {
        square.mouseOver = false;
        if (this.animatingRotation == true) {
            setTimeout(this.onMouseOutOfSquare.bind(this, square), 100);
            return;
        }
        square.focused = false;
        // square.style.background = "#676172";
        square.style.zIndex = "";
        square.style.boxShadow = "";

        // square.style.transform = "";
        await anime.timeline({loop: false}).add({
            targets: [square],
            scaleX: 1,
            scaleY: 1,
            easing: "easeOutExpo",
            duration: 100
        }).finished;

        square.cancelAnimation = true;
    }
    async takeSnapshot(project) {
        var canvas = await html2canvas(project, {y: window.innerHeight});
        return canvas;
    }
}

export {ProjectsDisplay};