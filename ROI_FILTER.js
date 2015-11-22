/*****************************************************

    [ ROI_FILTER.js ]

    The MIT License (MIT)

    Copyright (c) 2015 Yoshiki Shinagawa

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

******************************************************/


var ROI_FILTER = function(id) {

    //set canvas to ROI_FILTER.
    if(id!==undefined){
        this.setCanvas(id);
    }else{
        delete this.rect;
    }

    ROI_FILTER.prototype.setCanvas = function(id) {
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext("2d");
        this.rect = new ROI_FILTER_RECT(this.canvas,this.context);
        this.circle = new ROI_FILTER_CIRCLE(this.canvas,this.context);
        this.triangle = new ROI_FILTER_TRIANGLE(this.canvas,this.context);
        this.diamond = new ROI_FILTER_DIAMOND(this.canvas,this.context);
        this.polygon = new ROI_FILTER_POLYGON(this.canvas,this.context);
    };

    ROI_FILTER.prototype.set = function(){
        this.context = this.canvas.getContext("2d");
        this.rect = new ROI_FILTER_RECT(this.canvas,this.context);
        this.circle = new ROI_FILTER_CIRCLE(this.canvas,this.context);
        this.triangle = new ROI_FILTER_TRIANGLE(this.canvas,this.context);
        this.diamond = new ROI_FILTER_DIAMOND(this.canvas,this.context);
        this.polygon = new ROI_FILTER_POLYGON(this.canvas,this.context);
    };

    //contextを書き換えるための関数
    ROI_FILTER.prototype.setWindow = function(width, height) {
        if (width === undefined && height === undefined) {
            this.context = this.canvas.getContext("2d");
            this.canvas.width = 300;
            this.canvas.height = 300;
        } else {
            this.context = this.canvas.getContext("2d");
            this.canvas.width = width;
            this.canvas.height = height;
        }
    };
    
    /*画像描画関数*/
    ROI_FILTER.prototype.setImage = function(image_obj, w, h) {
        if (w !== undefined && h !== undefined) {
            this.canvas.width = w;
            this.canvas.height = h;
        } else {
            this.canvas.width = image_obj.width;
            this.canvas.height = image_obj.height;
        }
        this.context.drawImage(image_obj, 0, 0);
    };
    
    /*データの取得*/
    ROI_FILTER.prototype.getImageData = function(){
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    };

    /*データの書き込み*/
    ROI_FILTER.prototype.putImageData = function(dst){
        this.context.putImageData(dst,0,0);
    };

    ////////////////////////短形の処理//////////////////////////
    var ROI_FILTER_RECT = function(canvas,context){
        this.canvas = canvas;
        this.context = context;

        ROI_FILTER_RECT.prototype.sandstorm = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            //var dst = src;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    dst.data[i*this.canvas.width*4+j] = Math.ceil(Math.random() * 255);
                    dst.data[i*this.canvas.width*4+j + 1] = Math.ceil(Math.random() * 255);
                    dst.data[i*this.canvas.width*4+j + 2] = Math.ceil(Math.random() * 255);
                    dst.data[i*this.canvas.width*4+j + 3] = 255;
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        }

        ROI_FILTER_RECT.prototype.grayscale = function(x,y,w,h) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                    gray/=3;
                    dst.data[i*this.canvas.width*4+j] = gray;
                    dst.data[i*this.canvas.width*4+j + 1] = gray;
                    dst.data[i*this.canvas.width*4+j + 2] = gray;
                    dst.data[i*this.canvas.width*4+j + 3] = 255;
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.threshold = function(x,y,w,h,THRESHOLD) {
            var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var dst = src;
            if(THRESHOLD === undefined){
                THRESHOLD = 60;
            }
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    var gray = src.data[i*this.canvas.width*4+j]+src.data[i*this.canvas.width*4+j+1]+src.data[i*this.canvas.width*4+j+2];
                    gray/=3;
                    if(gray>THRESHOLD){
                        gray = 255;
                    }else{
                        gray = 0;
                    }
                    dst.data[i*this.canvas.width*4+j] = gray;
                    dst.data[i*this.canvas.width*4+j + 1] = gray;
                    dst.data[i*this.canvas.width*4+j + 2] = gray;
                    dst.data[i*this.canvas.width*4+j + 3] = 255;
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.scalar = function(x,y,w,h,r,g,b) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    dst.data[i*this.canvas.width*4+j] *= r;
                    dst.data[i*this.canvas.width*4+j + 1] *= g;
                    dst.data[i*this.canvas.width*4+j + 2] *= b;
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.canny = function(x,y,w,h,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(src.data[i*this.canvas.width*4+j-4]*0.5 + src.data[i*this.canvas.width*4+j+4]*0.5 > THRESHOLD){
                        dst.data[i*this.canvas.width*4+j] = 0;
                    }else{
                        dst.data[i*this.canvas.width*4+j] = 255;
                    }
                    if(src.data[i*this.canvas.width*4+j-3]*0.5 + src.data[i*this.canvas.width*4+j+5]*0.5 > THRESHOLD){
                        dst.data[i*this.canvas.width*4+j + 1] = 0;
                    }else{
                        dst.data[i*this.canvas.width*4+j + 1] = 255;
                    }
                    if(src.data[i*this.canvas.width*4+j-2]*0.5 + src.data[i*this.canvas.width*4+j+6]*0.5 > THRESHOLD){
                        dst.data[i*this.canvas.width*4+j + 2] = 0;
                    }else{
                        dst.data[i*this.canvas.width*4+j + 2] = 255;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.laplacian = function(x,y,w,h) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    var sum = LAPLACIAN_FILTER3(
                        src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                        src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                        src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                        );
                    dst.data[(i  )*this.canvas.width*4+j] = sum;

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                        sum = LAPLACIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                            src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                            src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                    }

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                        sum = LAPLACIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                            src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                            src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.reverse = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    dst.data[i*this.canvas.width*4+j] = Math.abs(255 - dst.data[i*this.canvas.width*4+j]);
                    dst.data[i*this.canvas.width*4+j + 1] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+1]);
                    dst.data[i*this.canvas.width*4+j + 2] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+2]);
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.fill = function(x,y,w,h,r,g,b){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(r>=0){
                        dst.data[i*this.canvas.width*4+j] = r;
                    }
                    if(g>=0){
                        dst.data[i*this.canvas.width*4+j+1] = g;
                    }
                    if(b>=0){
                        dst.data[i*this.canvas.width*4+j+2] = b;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.change = function(x,y,w,h,r,g,b){
            var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var dst = src;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }

            r = r.split("R").join("r");
            r = r.split("G").join("g");
            r = r.split("B").join("b");
            g = g.split("R").join("r");
            g = g.split("G").join("g");
            g = g.split("B").join("b");
            b = b.split("R").join("r");
            b = b.split("G").join("g");
            b = b.split("B").join("b");

            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(r==="g"){
                        dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+1];
                    }else if(r==="b"){
                        dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+2];
                    }

                    if(g==="r"){
                        dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j];
                    }else if(g==="b"){
                        dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j+2];
                    }

                    if(b==="g"){
                        dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j+1];
                    }else if(b==="r"){
                        dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j];
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.gaussian = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    var sum = GAUSSIAN_FILTER3(
                        src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                        src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                        src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                        );
                    dst.data[(i  )*this.canvas.width*4+j] = sum;

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                        sum = GAUSSIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                            src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                            src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                    }

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                        sum = GAUSSIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                            src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                            src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.average = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    var sum = AVERAGE_FILTER3(
                        src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                        src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                        src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                        );
                    dst.data[(i  )*this.canvas.width*4+j] = sum;

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                        sum = AVERAGE_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                            src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                            src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                    }

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                        sum = AVERAGE_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                            src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                            src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_RECT.prototype.median = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    var sum = MEDIAN_FILTER3(
                        src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                        src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                        src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                        );
                    dst.data[(i  )*this.canvas.width*4+j] = sum;

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                        sum = MEDIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                            src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                            src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                    }

                    if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                        sum = MEDIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                            src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                            src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                            );
                        dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                        
                    }else{
                        dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };
    };

    ////////////////////////円の処理//////////////////////////
    var ROI_FILTER_CIRCLE = function(canvas,context){
        this.canvas = canvas;
        this.context = context;

        ROI_FILTER_CIRCLE.prototype.sandstorm = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.center_x = x+w/2
            this.center_y = y+h/2
            this._w = w;
            this._h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-this.center_x)/this._w,2) + Math.pow(Math.abs(i-this.center_y)/this._h,2))<0.5){
                        dst.data[i*this.canvas.width*4+j] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.ceil(Math.random() * 255);
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_CIRCLE.prototype.grayscale = function(x,y,w,h) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_CIRCLE.prototype.threshold = function(x,y,w,h,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        if(gray>THRESHOLD){
                            gray = 255;
                        }else{
                            gray = 0;
                        }
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_CIRCLE.prototype.scalar = function(x,y,w,h,r,g,b){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        dst.data[i*this.canvas.width*4+j] *= r;
                        dst.data[i*this.canvas.width*4+j + 1] *= g;
                        dst.data[i*this.canvas.width*4+j + 2] *= b;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_CIRCLE.prototype.canny = function(x,y,w,h,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        if(src.data[i*this.canvas.width*4+j-4]*0.5 + src.data[i*this.canvas.width*4+j+4]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-3]*0.5 + src.data[i*this.canvas.width*4+j+5]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 1] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 1] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-2]*0.5 + src.data[i*this.canvas.width*4+j+6]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 2] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 2] = 255;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_CIRCLE.prototype.laplacian = function(x,y,w,h) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        var sum = LAPLACIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_CIRCLE.prototype.reverse = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        dst.data[i*this.canvas.width*4+j] = Math.abs(255 - dst.data[i*this.canvas.width*4+j]);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+1]);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+2]);
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_CIRCLE.prototype.fill = function(x,y,w,h,r,g,b){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        if(r>=0){
                            dst.data[i*this.canvas.width*4+j] = r;
                        }
                        if(g>=0){
                            dst.data[i*this.canvas.width*4+j+1] = g;
                        }
                        if(b>=0){
                            dst.data[i*this.canvas.width*4+j+2] = b;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_CIRCLE.prototype.change = function(x,y,w,h,r,g,b){
            var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var dst = src;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }

            r = r.split("R").join("r");
            r = r.split("G").join("g");
            r = r.split("B").join("b");
            g = g.split("R").join("r");
            g = g.split("G").join("g");
            g = g.split("B").join("b");
            b = b.split("R").join("r");
            b = b.split("G").join("g");
            b = b.split("B").join("b");

            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        if(r==="g"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+1];
                        }else if(r==="b"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(g==="r"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j];
                        }else if(g==="b"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(b==="g"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j+1];
                        }else if(b==="r"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_CIRCLE.prototype.gaussian = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        var sum = GAUSSIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_CIRCLE.prototype.average = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        var sum = AVERAGE_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_CIRCLE.prototype.median = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(Math.sqrt(Math.pow(Math.abs(j/4-center_x)/_w,2) + Math.pow(Math.abs(i-center_y)/_h,2))<0.5){
                        var sum = MEDIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };
    };

    ////////////////////////三角形の処理//////////////////////////
    var ROI_FILTER_TRIANGLE = function(canvas,context){
        this.canvas = canvas;
        this.context = context;

        ROI_FILTER_TRIANGLE.prototype.VertexMIN_A_MAX = function(x1,y1,x2,y2,x3,y3){
            var array = [0,0,0,0];
            if(x1>x2){
                if(x2>x3){
                    array[0] = x3;
                    array[1] = x1;
                }else{
                    if(x1>x3){
                        array[0] = x2
                        array[1] = x1
                    }else{
                        array[0] = x2;
                        array[1] = x3;
                    }
                }
            }else{
                if(x1>x3){
                    array[0] = x3;
                    array[1] = x2;
                }else{
                    if(x2>x3){
                        array[0] = x1;
                        array[1] = x2;
                    }else{
                        array[0] = x1;
                        array[1] = x3;
                    }
                }
            }

            if(y1>y2){
                if(y2>y3){
                    array[2] = y3;
                    array[3] = y1;
                }else{
                    if(y1>y3){
                        array[2] = y2;
                        array[3] = y1;
                    }else{
                        array[2] = y2;
                        array[3] = y3;
                    }
                }
            }else{
                if(y1>y3){
                    array[2] = y3;
                    array[3] = y2;
                }else{
                    if(y2>y3){
                        array[2] = y1;
                        array[3] = y2;
                    }else{
                        array[2] = y1;
                        array[3] = y3;
                    }
                }
            }
            return array;
        };

        ROI_FILTER_TRIANGLE.prototype.DRAW_TRIANGLE = function(x1,y1,x2,y2,x3,y3){
            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.context.fillStyle = 'rgba(255, 255, 255, 1)';
            this.context.fillRect(x,y,w,h);
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.lineTo(x3, y3);
            this.context.closePath();
            this.context.fillStyle = 'rgba(0, 0, 0, 1)';
            this.context.fill();
        };

        ROI_FILTER_TRIANGLE.prototype.sandstorm = function(x1,y1,x2,y2,x3,y3){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            ///三角形の描画
            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }

            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        dst.data[i*this.canvas.width*4+j] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.ceil(Math.random() * 255);
                    }
                } 
            }

            
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_TRIANGLE.prototype.grayscale = function(x1,y1,x2,y2,x3,y3) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                        dst.data[i*this.canvas.width*4+j + 3] = 255;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.threshold = function(x1,y1,x2,y2,x3,y3,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            if(THRESHOLD === undefined){
                THRESHOLD = 60;
            }
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        if(gray>THRESHOLD){
                            gray = 255;
                        }else{
                            gray = 0;
                        }
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.scalar = function(x1,y1,x2,y2,x3,y3,r,g,b) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        dst.data[i*this.canvas.width*4+j] *= r;
                        dst.data[i*this.canvas.width*4+j + 1] *= g;
                        dst.data[i*this.canvas.width*4+j + 2] *= b;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.canny = function(x1,y1,x2,y2,x3,y3,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;

            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            if(THRESHOLD === undefined){
                THRESHOLD = 60;
            }

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        if(src.data[i*this.canvas.width*4+j-4]*0.5 + src.data[i*this.canvas.width*4+j+4]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-3]*0.5 + src.data[i*this.canvas.width*4+j+5]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 1] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 1] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-2]*0.5 + src.data[i*this.canvas.width*4+j+6]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 2] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 2] = 255;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.laplacian = function(x1,y1,x2,y2,x3,y3) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;

            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = LAPLACIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.reverse = function(x1,y1,x2,y2,x3,y3){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        dst.data[i*this.canvas.width*4+j] = Math.abs(255 - dst.data[i*this.canvas.width*4+j]);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+1]);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+2]);
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.fill = function(x1,y1,x2,y2,x3,y3,r,g,b){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        if(r>=0){
                            dst.data[i*this.canvas.width*4+j] = r;
                        }
                        if(g>=0){
                            dst.data[i*this.canvas.width*4+j+1] = g;
                        }
                        if(b>=0){
                            dst.data[i*this.canvas.width*4+j+2] = b;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.change = function(x1,y1,x2,y2,x3,y3,r,g,b){
            var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var dst = src;
            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }

            r = r.split("R").join("r");
            r = r.split("G").join("g");
            r = r.split("B").join("b");
            g = g.split("R").join("r");
            g = g.split("G").join("g");
            g = g.split("B").join("b");
            b = b.split("R").join("r");
            b = b.split("G").join("g");
            b = b.split("B").join("b");

            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        if(r==="g"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+1];
                        }else if(r==="b"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(g==="r"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j];
                        }else if(g==="b"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(b==="g"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j+1];
                        }else if(b==="r"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.gaussian = function(x1,y1,x2,y2,x3,y3){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = GAUSSIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.average = function(x1,y1,x2,y2,x3,y3){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = AVERAGE_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_TRIANGLE.prototype.median = function(x1,y1,x2,y2,x3,y3){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var array = this.VertexMIN_A_MAX(x1,y1,x2,y2,x3,y3);
            var x = array[0], y = array[2], w = array[1]-array[0], h = array[3]-array[2];
            this.DRAW_TRIANGLE(x1,y1,x2,y2,x3,y3);
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = MEDIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };
    };

    ////////////////////////菱形の処理//////////////////////////
    var ROI_FILTER_DIAMOND = function(canvas,context){
        this.canvas = canvas;
        this.context = context;

        ROI_FILTER_DIAMOND.prototype.sandstorm = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.center_x = x+w/2
            this.center_y = y+h/2
            this._w = w;
            this._h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        dst.data[i*this.canvas.width*4+j] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.ceil(Math.random() * 255);
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_DIAMOND.prototype.grayscale = function(x,y,w,h) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_DIAMOND.prototype.threshold = function(x,y,w,h,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        if(gray>THRESHOLD){
                            gray = 255;
                        }else{
                            gray = 0;
                        }
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_DIAMOND.prototype.scalar = function(x,y,w,h,r,g,b){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            var i,j
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        dst.data[i*this.canvas.width*4+j] *= r;
                        dst.data[i*this.canvas.width*4+j + 1] *= g;
                        dst.data[i*this.canvas.width*4+j + 2] *= b;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_DIAMOND.prototype.canny = function(x,y,w,h,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        if(src.data[i*this.canvas.width*4+j-4]*0.5 + src.data[i*this.canvas.width*4+j+4]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-3]*0.5 + src.data[i*this.canvas.width*4+j+5]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 1] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 1] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-2]*0.5 + src.data[i*this.canvas.width*4+j+6]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 2] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 2] = 255;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_DIAMOND.prototype.laplacian = function(x,y,w,h) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        var sum = LAPLACIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_DIAMOND.prototype.reverse = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        dst.data[i*this.canvas.width*4+j] = Math.abs(255 - dst.data[i*this.canvas.width*4+j]);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+1]);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+2]);
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_DIAMOND.prototype.fill = function(x,y,w,h,r,g,b){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        if(r>=0){
                            dst.data[i*this.canvas.width*4+j] = r;
                        }
                        if(g>=0){
                            dst.data[i*this.canvas.width*4+j+1] = g;
                        }
                        if(b>=0){
                            dst.data[i*this.canvas.width*4+j+2] = b;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_DIAMOND.prototype.change = function(x,y,w,h,r,g,b){
            var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var dst = src;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }

            r = r.split("R").join("r");
            r = r.split("G").join("g");
            r = r.split("B").join("b");
            g = g.split("R").join("r");
            g = g.split("G").join("g");
            g = g.split("B").join("b");
            b = b.split("R").join("r");
            b = b.split("G").join("g");
            b = b.split("B").join("b");

            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        if(r==="g"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+1];
                        }else if(r==="b"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(g==="r"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j];
                        }else if(g==="b"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(b==="g"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j+1];
                        }else if(b==="r"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_DIAMOND.prototype.gaussian = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        var sum = GAUSSIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_DIAMOND.prototype.average = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        var sum = AVERAGE_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_DIAMOND.prototype.median = function(x,y,w,h){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            var center_x = x+w/2
            var center_y = y+h/2
            var _w = w;
            var _h = h;
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if((Math.abs(j/4-this.center_x)/this._w + Math.abs(i-this.center_y)/this._h)<0.5){
                        var sum = MEDIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };
    };

    var ROI_FILTER_POLYGON = function(canvas,context){
        this.canvas = canvas;
        this.context = context;

        ROI_FILTER_POLYGON.prototype.DRAW_POLYGON = function(array_x,array_y){

            var array_x1 = array_x.concat();
            var array_y1 = array_y.concat();
            array_x1 = SORT_ARRAY(array_x1);
            array_y1 = SORT_ARRAY(array_y1);

            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            this.context.fillStyle = 'rgba(255, 255, 255, 1)';
            this.context.fillRect(x,y,w,h);

            this.context.beginPath();
            this.context.moveTo(array_x[0], array_y[0]);

            for(var i=1;i<array_x.length;i++){
                this.context.lineTo(array_x[i], array_y[i]);
            }
            this.context.closePath();
            this.context.fillStyle = 'rgba(0, 0, 0, 1)';
            this.context.fill();
        };

        ROI_FILTER_POLYGON.prototype.sandstorm = function(array_x,array_y){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            ///三角形の描画
            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width;
            }
            if(h>canvas.height){
                h=canvas.height;
            }
            var i,j;
            for(i = y; i < h; i ++){
                for(j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        dst.data[i*this.canvas.width*4+j] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.ceil(Math.random() * 255);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.ceil(Math.random() * 255);
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
            return;
        };

        ROI_FILTER_POLYGON.prototype.grayscale = function(array_x,array_y) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                        dst.data[i*this.canvas.width*4+j + 3] = 255;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.threshold = function(array_x,array_y,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            if(THRESHOLD === undefined){
                THRESHOLD = 60;
            }
            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
                        gray/=3;
                        if(gray>THRESHOLD){
                            gray = 255;
                        }else{
                            gray = 0;
                        }
                        dst.data[i*this.canvas.width*4+j] = gray;
                        dst.data[i*this.canvas.width*4+j + 1] = gray;
                        dst.data[i*this.canvas.width*4+j + 2] = gray;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.scalar = function(array_x,array_y,r,g,b) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        dst.data[i*this.canvas.width*4+j] *= r;
                        dst.data[i*this.canvas.width*4+j + 1] *= g;
                        dst.data[i*this.canvas.width*4+j + 2] *= b;
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.canny = function(array_x,array_y,THRESHOLD) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;

            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            if(THRESHOLD === undefined){
                THRESHOLD = 60;
            }

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        if(src.data[i*this.canvas.width*4+j-4]*0.5 + src.data[i*this.canvas.width*4+j+4]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-3]*0.5 + src.data[i*this.canvas.width*4+j+5]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 1] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 1] = 255;
                        }
                        if(src.data[i*this.canvas.width*4+j-2]*0.5 + src.data[i*this.canvas.width*4+j+6]*0.5 > THRESHOLD){
                            dst.data[i*this.canvas.width*4+j + 2] = 0;
                        }else{
                            dst.data[i*this.canvas.width*4+j + 2] = 255;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.laplacian = function(array_x,array_y) {
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;

            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = LAPLACIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = LAPLACIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.reverse = function(array_x,array_y){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        dst.data[i*this.canvas.width*4+j] = Math.abs(255 - dst.data[i*this.canvas.width*4+j]);
                        dst.data[i*this.canvas.width*4+j + 1] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+1]);
                        dst.data[i*this.canvas.width*4+j + 2] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+2]);
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.fill = function(array_x,array_y,r,g,b){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        if(r>=0){
                            dst.data[i*this.canvas.width*4+j] = r;
                        }
                        if(g>=0){
                            dst.data[i*this.canvas.width*4+j+1] = g;
                        }
                        if(b>=0){
                            dst.data[i*this.canvas.width*4+j+2] = b;
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.change = function(array_x,array_y,r,g,b){
            var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var dst = src;
            
            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }

            r = r.split("R").join("r");
            r = r.split("G").join("g");
            r = r.split("B").join("b");
            g = g.split("R").join("r");
            g = g.split("G").join("g");
            g = g.split("B").join("b");
            b = b.split("R").join("r");
            b = b.split("G").join("g");
            b = b.split("B").join("b");

            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        if(r==="g"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+1];
                        }else if(r==="b"){
                            dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(g==="r"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j];
                        }else if(g==="b"){
                            dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j+2];
                        }

                        if(b==="g"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j+1];
                        }else if(b==="r"){
                            dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.gaussian = function(array_x,array_y){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            
            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = GAUSSIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = GAUSSIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.average = function(array_x,array_y){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            
            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = AVERAGE_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = AVERAGE_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };

        ROI_FILTER_POLYGON.prototype.median = function(array_x,array_y){
            var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var src = dst;
            
            this.DRAW_POLYGON(array_x,array_y);
            var array_x1 = SORT_ARRAY(array_x);
            var array_y1 = SORT_ARRAY(array_y);
            var x = array_x1[0], y = array_y1[0], w = array_x1[array_x1.length-1]-array_x1[0], h = array_y1[array_y1.length-1]-array_y1[0];
            var dst2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            w+=x;
            h+=y;
            if(w>canvas.width){
                w=canvas.width
            }
            if(h>canvas.height){
                h=canvas.height
            }
            if(x<0){
                x=0;
            }
            if(y<0){
                y=0;
            }
            for(var i = y; i < h; i ++){
                for(var j = x*4; j<w*4 ;j+=4){
                    if(dst2.data[i*this.canvas.width*4+j] < 30 ){
                        var sum = MEDIAN_FILTER3(
                            src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                            src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                            src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                            );
                        dst.data[(i  )*this.canvas.width*4+j] = sum;

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                                src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                                src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
                        }

                        if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                            sum = MEDIAN_FILTER3(
                                src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                                src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                                src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                                );
                            dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                            
                        }else{
                            dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
                        }
                    }
                } 
            }
            this.context.putImageData(dst, 0, 0);
        };
    };

    function LAPLACIAN_FILTER3(a,b,c,d,e,f,g,h,i){
        if(a===null||a===undefined){
            a=0;
        }
        if(b===null||b===undefined){
            b=0;
        }
        if(c===null||c===undefined){
            c=0;
        }
        if(d===null||d===undefined){
            d=0;
        }
        if(e===null||e===undefined){
            e=0;
        }
        if(f===null||f===undefined){
            a=0;
        }
        if(g==null||g===undefined){
            a=0;
        }
        if(h==null||h===undefined){
            a=0;
        }
        if(i==null||i===undefined){
            a=0;
        }
        var sum = a+b+c+d-8*e+f+g+h+i;
        if(sum>255){
            sum = 255;
        }
        if(sum<0){
            sum = 0
        }
        return sum;
    }
    ROI_FILTER.prototype.LAPLACIAN_FILTER3 = function(a,b,c,d,e,f,g,h,i){
        return LAPLACIAN_FILTER3(a,b,c,d,e,f,g,h,i);
    };

    function GAUSSIAN_FILTER3(a,b,c,d,e,f,g,h,i){
        if(a===null||a===undefined){
            a=d;
        }
        if(b===null||b===undefined){
            b=e;
        }
        if(c===null||c===undefined){
            c=f;
        }
        if(d===null||d===undefined){
            d=0;
        }
        if(e===null||e===undefined){
            e=0;
        }
        if(f===null||f===undefined){
            a=0;
        }
        if(g==null||g===undefined){
            a=d;
        }
        if(h==null||h===undefined){
            a=e;
        }
        if(i==null||i===undefined){
            a=f;
        }
        var sum = a/16+b/8+c/16+d/8+e/4+f/8+g/16+h/8+i/16;
        if(sum>255){
            sum = 255;
        }
        if(sum<0){
            sum = 0
        }
        return sum;
    }
    ROI_FILTER.prototype.GAUSSIAN_FILTER3 = function(a,b,c,d,e,f,g,h,i){
        return GAUSSIAN_FILTER3(a,b,c,d,e,f,g,h,i);
    };

    function AVERAGE_FILTER3(a,b,c,d,e,f,g,h,i){
        if(a===null||a===undefined){
            a=0;
        }
        if(b===null||b===undefined){
            b=0;
        }
        if(c===null||c===undefined){
            c=0;
        }
        if(d===null||d===undefined){
            d=0;
        }
        if(e===null||e===undefined){
            e=0;
        }
        if(f===null||f===undefined){
            a=0;
        }
        if(g==null||g===undefined){
            a=0;
        }
        if(h==null||h===undefined){
            a=0;
        }
        if(i==null||i===undefined){
            a=0;
        }
        var sum = a/9+b/9+c/9+d/9+e/9+f/9+g/9+h/9+i/9;
        if(sum>255){
            sum = 255;
        }
        if(sum<0){
            sum = 0
        }
        return sum;
    }
    ROI_FILTER.prototype.AVERAGE_FILTER3 = function(a,b,c,d,e,f,g,h,i){
        return AVERAGE_FILTER3(a,b,c,d,e,f,g,h,i);
    };

    function MEDIAN_FILTER3(a,b,c,d,e,f,g,h,i){
        var array = [a,b,c,d,e,f,g,h,i];
        array.sort(function(a,b){
            if(a<b)
                return -1;
            if(a>b)
                return 1;
            return 0;
        });
        var sum = array[4];
        if(sum>255){
            sum = 255;
        }
        if(sum<0){
            sum = 0
        }
        return sum;
    }
    ROI_FILTER.prototype.MEDIAN_FILTER3 = function(a,b,c,d,e,f,g,h,i){
        return MEDIAN_FILTER3(a,b,c,d,e,f,g,h,i);
    };

    function SORT_ARRAY(x){
        x.sort(function(a,b){
            if(a<b)
                return -1;
            if(a>b)
                return 1;
            return 0;
        });
        return x;
    }
    ROI_FILTER.prototype.SORT_ARRAY = function(x){
        return SORT_ARRAY(x);
    };
};


ROI_FILTER.prototype.sandstorm = function(){
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;

    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    //var dst = src;
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            dst.data[i*this.canvas.width*4+j] = Math.ceil(Math.random() * 255);
            dst.data[i*this.canvas.width*4+j + 1] = Math.ceil(Math.random() * 255);
            dst.data[i*this.canvas.width*4+j + 2] = Math.ceil(Math.random() * 255);
            dst.data[i*this.canvas.width*4+j + 3] = 255;
        } 
    }
    this.context.putImageData(dst, 0, 0);
    return;
}

ROI_FILTER.prototype.grayscale = function() {
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            var gray = dst.data[i*this.canvas.width*4+j]+dst.data[i*this.canvas.width*4+j+1]+dst.data[i*this.canvas.width*4+j+2];
            gray/=3;
            dst.data[i*this.canvas.width*4+j] = gray;
            dst.data[i*this.canvas.width*4+j + 1] = gray;
            dst.data[i*this.canvas.width*4+j + 2] = gray;
            dst.data[i*this.canvas.width*4+j + 3] = 255;
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.threshold = function(THRESHOLD) {
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var dst = src;
    if(THRESHOLD === undefined){
        THRESHOLD = 60;
    }
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            var gray = src.data[i*this.canvas.width*4+j]+src.data[i*this.canvas.width*4+j+1]+src.data[i*this.canvas.width*4+j+2];
            gray/=3;
            if(gray>THRESHOLD){
                gray = 255;
            }else{
                gray = 0;
            }
            dst.data[i*this.canvas.width*4+j] = gray;
            dst.data[i*this.canvas.width*4+j + 1] = gray;
            dst.data[i*this.canvas.width*4+j + 2] = gray;
            dst.data[i*this.canvas.width*4+j + 3] = 255;
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.scalar = function(r,g,b) {
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            dst.data[i*this.canvas.width*4+j] *= r;
            dst.data[i*this.canvas.width*4+j + 1] *= g;
            dst.data[i*this.canvas.width*4+j + 2] *= b;
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.canny = function(THRESHOLD) {
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var src = dst;
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            if(src.data[i*this.canvas.width*4+j-4]*0.5 + src.data[i*this.canvas.width*4+j+4]*0.5 > THRESHOLD){
                dst.data[i*this.canvas.width*4+j] = 0;
            }else{
                dst.data[i*this.canvas.width*4+j] = 255;
            }
            if(src.data[i*this.canvas.width*4+j-3]*0.5 + src.data[i*this.canvas.width*4+j+5]*0.5 > THRESHOLD){
                dst.data[i*this.canvas.width*4+j + 1] = 0;
            }else{
                dst.data[i*this.canvas.width*4+j + 1] = 255;
            }
            if(src.data[i*this.canvas.width*4+j-2]*0.5 + src.data[i*this.canvas.width*4+j+6]*0.5 > THRESHOLD){
                dst.data[i*this.canvas.width*4+j + 2] = 0;
            }else{
                dst.data[i*this.canvas.width*4+j + 2] = 255;
            }
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.laplacian = function() {
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var src = dst;
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            var sum = this.LAPLACIAN_FILTER3(
                src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                );
            dst.data[(i  )*this.canvas.width*4+j] = sum;

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                sum = this.LAPLACIAN_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                    src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                    src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                    );
                dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
            }

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                sum = this.LAPLACIAN_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                    src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                    src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                    );
                dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
            }
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.reverse = function(){
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            dst.data[i*this.canvas.width*4+j] = Math.abs(255 - dst.data[i*this.canvas.width*4+j]);
            dst.data[i*this.canvas.width*4+j + 1] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+1]);
            dst.data[i*this.canvas.width*4+j + 2] = Math.abs(255 - dst.data[i*this.canvas.width*4+j+2]);
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.fill = function(r,g,b){
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            if(r>=0){
                dst.data[i*this.canvas.width*4+j] = r;
            }
            if(g>=0){
                dst.data[i*this.canvas.width*4+j+1] = g;
            }
            if(b>=0){
                dst.data[i*this.canvas.width*4+j+2] = b;
            }
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.change = function(r,g,b){
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var src = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var dst = src;
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }

    r = r.split("R").join("r");
    r = r.split("G").join("g");
    r = r.split("B").join("b");
    g = g.split("R").join("r");
    g = g.split("G").join("g");
    g = g.split("B").join("b");
    b = b.split("R").join("r");
    b = b.split("G").join("g");
    b = b.split("B").join("b");

    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            if(r==="g"){
                dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+1];
            }else if(r==="b"){
                dst.data[i*this.canvas.width*4+j] = src.data[i*this.canvas.width*4+j+2];
            }

            if(g==="r"){
                dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j];
            }else if(g==="b"){
                dst.data[i*this.canvas.width*4+j+1] = src.data[i*this.canvas.width*4+j+2];
            }

            if(b==="g"){
                dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j+1];
            }else if(b==="r"){
                dst.data[i*this.canvas.width*4+j+2] = src.data[i*this.canvas.width*4+j];
            }
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.gaussian = function(){
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var src = dst;
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            var sum = this.GAUSSIAN_FILTER3(
                src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                );
            dst.data[(i  )*this.canvas.width*4+j] = sum;

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                sum = this.GAUSSIAN_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                    src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                    src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                    );
                dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
            }

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                sum = this.GAUSSIAN_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                    src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                    src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                    );
                dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
            }
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.average = function(){
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var src = dst;
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            var sum = this.AVERAGE_FILTER3(
                src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                );
            dst.data[(i  )*this.canvas.width*4+j] = sum;

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                sum = this.AVERAGE_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                    src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                    src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                    );
                dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
            }

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                sum = this.AVERAGE_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                    src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                    src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                    );
                dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
            }
        } 
    }
    this.context.putImageData(dst, 0, 0);
};

ROI_FILTER.prototype.median = function(){
    var canvas = this.canvas;
    var context = this.context;
    var x=0,y=0,w = canvas.width,h=canvas.height;
    var dst = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var src = dst;
    w+=x;
    h+=y;
    if(w>canvas.width){
        w=canvas.width
    }
    if(h>canvas.height){
        h=canvas.height
    }
    if(x<0){
        x=0;
    }
    if(y<0){
        y=0;
    }
    for(var i = y; i < h; i ++){
        for(var j = x*4; j<w*4 ;j+=4){
            var sum = this.MEDIAN_FILTER3(
                src.data[(i-1)*this.canvas.width*4+j-4], src.data[(i-1)*this.canvas.width*4+j], src.data[(i-1)*this.canvas.width*4+j+4],
                src.data[(i  )*this.canvas.width*4+j-4], src.data[(i  )*this.canvas.width*4+j], src.data[(i  )*this.canvas.width*4+j+4],
                src.data[(i+1)*this.canvas.width*4+j-4], src.data[(i+1)*this.canvas.width*4+j], src.data[(i+1)*this.canvas.width*4+j+4]
                );
            dst.data[(i  )*this.canvas.width*4+j] = sum;

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+1]){
                sum = this.MEDIAN_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+1], src.data[(i-1)*this.canvas.width*4+j+1], src.data[(i-1)*this.canvas.width*4+j+4+1],
                    src.data[(i  )*this.canvas.width*4+j-4+1], src.data[(i  )*this.canvas.width*4+j+1], src.data[(i  )*this.canvas.width*4+j+4+1],
                    src.data[(i+1)*this.canvas.width*4+j-4+1], src.data[(i+1)*this.canvas.width*4+j+1], src.data[(i+1)*this.canvas.width*4+j+4+1]
                    );
                dst.data[(i  )*this.canvas.width*4+j+1] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+1] = dst.data[(i  )*this.canvas.width*4+j];
            }

            if(src.data[(i)*this.canvas.width*4+j]!==src.data[(i  )*this.canvas.width*4+j+2]){
                sum = this.MEDIAN_FILTER3(
                    src.data[(i-1)*this.canvas.width*4+j-4+2], src.data[(i-1)*this.canvas.width*4+j+2], src.data[(i-1)*this.canvas.width*4+j+4+2],
                    src.data[(i  )*this.canvas.width*4+j-4+2], src.data[(i  )*this.canvas.width*4+j+2], src.data[(i  )*this.canvas.width*4+j+4+2],
                    src.data[(i+1)*this.canvas.width*4+j-4+2], src.data[(i+1)*this.canvas.width*4+j+2], src.data[(i+1)*this.canvas.width*4+j+4+2]
                    );
                dst.data[(i  )*this.canvas.width*4+j+2] = sum;
                
            }else{
                dst.data[(i  )*this.canvas.width*4+j+2] = dst.data[(i  )*this.canvas.width*4+j];
            }
        } 
    }
    this.context.putImageData(dst, 0, 0);
};


