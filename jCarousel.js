/**
 * jCarousel v1.2 - A HTML5 Carousel library with Canvas support
 * Depends: jCanvas v2.0 (optional for arrows)
 * 
 * Copyright (C) 2011, 2013 Alex Scheel
 * All rights reserved.
 * Licensed under BSD 2 Clause License:
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, 
 *   this list of conditions and the following disclaimer in the documentation 
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
**/

/**
 * Usage:
 * carousel = new jCarouse();
 * carousel.addElement(" ", "Hello", "http://google.com");
 * carousel.addElement(" ", "World", "http://apple.com");
 * carousel.setDisplay(1);
 * carousel.init('div-carousel-id');
 *
 * API:
 * Main:
 *   init(container element id) - Builds carousel and initializes it.
 *   
 *   update() - updates carousel display
 *   
 *   movePrev() - moves to previous element's position, updates carousel display
 *   
 *   moveNext() - moves to next element's position, updates carousel display
 *   
 * Config:
 *   addElement(image, title, link) - adds element to carousel
 *     returns: position of new element if success
 *              else -1
 *   
 *   delElement(position) - removes element from carousel
 *     returns: -1 on fail, else nothing
 *   
 *   enableArrow() - enables scrolling arrows on carousel
 *                   (default arrows are buttons, optional canvas arrows)
 *   
 *   disableArrow() - disables scrolling arrows on carousel
 *   
 *   setLeftArrow(width, height, color) - set up canvas left arrow
 *   
 *   setRightArrow(width, height, color) - set up canvas right arrow
 *   
 *   setDisplay(count) - set number of elements to dispaly at once
 *   
 * Getters:
 *   getElement(position) / getElement()
 *     returns: element at position or current element
 *   
 *   getPrevious(position) / getPrevious()
 *     returns: element at previous location from position or current
 *   
 *   getPrevNumb(position) / getPrevNumb() 
 *     returns: position of previous element from position or current
 *              -1 on fail
 *   
 *   getNext(position) / getNext()
 *     returns: element at next location from position or current
 *   
 *   getNextNumb(position) / getNextNumb()
 *     returns: position of next element from position or current
 *              -1 on fail
 *   
 *   getLeftArrow()
 *     returns: contents of larrow
 *   
 *   getRightArrow()
 *     returns: contents of rarrow
 *   
 *   buildElement(position) / buildElement()
 *     returns: carousel element at position
**/

function jCarousel() {
    this.celement = '';
    this.element = new Array();
    this.current = 0;
    this.start = 0;
    this._counter = 0;
    this.display = 3;
    
    this.arrows = false;
    this.larrow = '<div class="element" id="carouselLeftArrow"><button onclick="carousel.movePrev()">Prev</button></div>';
    this.lawidth = 0;
    this.laheight = 0;
    this.lacolor = '#222';
    this.rarrow = '<div class="element" id="carouselRightArrow"><button onclick="carousel.moveNext()">Next</button></div>';
    this.rawidth = 0;
    this.raheight = 0;
    this.racolor = '#222';
    
    this.init = function(id) {
        this.celement = id;
        this.update();
    }
    
    this.addElement = function(image, title, location) {
        if ((image != '') && (title != '') && (location != '')) {
            this.element[this._counter] = new Array(image, title, location);
            this._counter += 1;
            return this._counter-1;
        } else {
            return -1;
        }
    }
    
    this.delElement = function(pos) {
        if ((pos != '') && (pos != undefined)) {
            this.element = this.element.slice(((pos+2)*-1), (pos*-1));
        } else {
            return -1;
        }
    }
    
    this.getElement = function(pos) {
        if (pos == undefined) {
            pos = this.current;
        }
        
        return this.element[pos];
    }
    
    this.getPrevious = function(pos) {
        if (pos == undefined) {
            pos = this.current;
        }
        
        if (pos == 0) {
            pos = this._counter-1;
        } else {
            pos -= 1;
        }
        
        return this.element[pos];
    }
    
    this.getPrevNumb = function (pos) {
        if (pos == undefined) {
            pos = this.current;
        }
        
        if (pos == 0) {
            pos = this._counter-1;
        } else {
            pos -= 1;
        }
        
        return pos;
    }
    
    this.getNext = function(pos) {
        if (pos == undefined) {
            pos = this.current;
        }
        
        if (pos == (this._counter-1)) {
            pos = 0;
        } else {
            pos += 1;
        }
        
        return this.element[pos];
    }
    
    this.getNextNumb = function (pos) {
        if (pos == undefined) {
            pos = this.current;
        }
        
        if (pos == (this._counter-1)) {
            pos = 0;
        } else {
            pos += 1;
        }
        
        return pos;
    }
    
    this.movePrev = function() {
        this.current -= 1;
        if (this.current == -1) {
            this.current = this._counter-1;
        }
        
        this.update();
    }
    
    this.moveNext = function() {
        this.current += 1;
        if (this.current == this._counter) {
            this.current = 0;
        }
        
        this.update();
    }
    
    this.buildElement = function(pos) {
        if (pos == undefined) {
            pos = this.current;
        }
        
        var current = this.element[pos];
        var cimg = current[0];
        var ctitle = current[1];
        var chref = current[2];
        return '<div class="image" id="i' + pos + 'd"><a class="image" id="i' + pos + 'a" href="' + chref + '"><img class="image" id="i' + pos + 'i" src="' + cimg + '" alt="' + ctitle + '"></a></div><div class="title" id="t' + pos + 'd"><a class="title" id="t' + pos + 'a" href="' + chref + '">' + ctitle + '</a></div>';
    }
    
    this.enableArrows = function() {
        this.arrows = true;
    }
    
    this.disableArrows = function() {
        this.arrows = false;
    }
    
    this.setLeftArrow = function(width, height, color) {
        this.larrow = '<div class="element"><canvas id="carouselLeftArrow" onclick="carousel.movePrev()" width="' + width + 'px" height="' + height + 'px"></canvas></div>';
        this.lawidth = width;
        this.laheight = height;
        this.lacolor = color;
    }
    
    this.getLeftArrow = function() {
        return this.larrow;
    }
    
    this.setRightArrow = function(width, height, color) {
        this.rarrow = '<div class="element"><canvas id="carouselRightArrow" onclick="carousel.moveNext()" width="' + width + 'px" height="' + height + 'px"></canvas></div>';
        this.rawidth = width;
        this.raheight = height;
        this.racolor = color;
    }
    
    this.getRightArrow = function() {
        return this.rarrow;
    }
    
    this.setDisplay = function(count) {
        this.display = count;
    }
    
    this.update = function() {
        var result = '';
        var zcenter = this.display/2;
        if (zcenter != Math.floor(zcenter)) {
            zcenter = Math.floor(zcenter)+1;
        }
        for (var i = 1; i <= this.display; i++) {
            var tmpid = this.current;
            if (i < zcenter) {
                loopTimes = zcenter - i;
                tmpid = this.current;
                for (var j = 0; j < loopTimes; j++) {
                    tmpid = this.getPrevNumb(tmpid);
                }
                result += '<div class="element">' + this.buildElement(tmpid) + '</div>';
            } else if (i == zcenter) {
                result += '<div class="element">' + this.buildElement(this.current) + '</div>';
            } else {
                loopTimes = i - zcenter;
                tmpid = this.current;
                for (var j = 0; j < loopTimes; j++) {
                    tmpid = this.getNextNumb(tmpid);
                }
                result += '<div class="element">' + this.buildElement(tmpid) + '</div>';
            }
        }
        if (this.arrows == true) {
            result = this.getLeftArrow() + result + this.getRightArrow();
        }
        $('#'+this.celement).html(result);
        if (this.lawidth != '') {
            lcanvas = document.getElementById('carouselLeftArrow');
            lctx = lcanvas.getContext('2d');
            jCanvasDraw(lctx, lcanvas, 'cs,cw,b,m:' + (this.lawidth-10) + ':' + (this.laheight-10) + ',l:' + (this.lawidth-10) + ':10,l:10:' + (this.laheight/2) + ',l:' + (this.lawidth-10) + ':' + (this.laheight-10) + ',l:' + (this.lawidth-10) + ':10,fs:' + this.lacolor + ',ss:' + this.lacolor + ',w:5,j:round,s,f,c');
        }
        if (this.rawidth != '') {
            rcanvas = document.getElementById('carouselRightArrow');
            rctx = rcanvas.getContext('2d');
            jCanvasDraw(rctx, rcanvas, 'cs,cw,b,m:10:' + (this.raheight-10) + ',l:10:10,l:' + (this.rawidth-10) + ':' + (this.raheight/2) + ',l:10:' + (this.raheight-10) + ',l:10:10,fs:' + this.racolor + ',ss:' + this.racolor + ',w:5,j:round,s,f,c');
        }
    }
}

