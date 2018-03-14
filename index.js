
var image = new Image();
image.src = "./picture/lena.png";
var xx = 0;

window.onload = function(){
    
    try {
        //alert("aa");
        var cv = new ROI_FILTER();
        cv.setCanvas("canvas1")
        cv.setImage(image, 300, 300);
        //cv.rect.sandstorm(0,0,100,300);
        var x = 0;

        
        function tt() {
            //alert()
            x++;
            cv.setImage(image, 512, 512);
            //cv.circle.threshold(50,x,0,100,100);
            //cv.rect.threshold(50,x,0,290,290);
            //cv.rect.scalar(1,0,0,x   ,30,40,40);
            // cv.rect.scalar(0,1,0,x+20,60,40,40);
            //cv.rect.scalar(0,0,1,x+40,90,40,40);
            //cv.rect.change(x,0,150,300,"g","b","r");

            //cv.rect.median3(x-50,200,100,100);
            //cv.triangle.scalar(27+x,30,100,170,300,200,0.9,0.5,1);
            //cv.triangle.sandstorm(100,50,50,100,150,100);
            //cv.diamond.sandstorm(x,150,100,150);
            // cv.rect.grayscale(x,150,100,150);
            //cv.polygon.sandstorm([70,30,30,180,250],[30,80,160,160,80]);
            //cv.polygon.sandstorm([100,50,150,200],[50,100,100,50]);
            //cv.rect.grayscale(x,100,300,300);
            cv.threshold(100);
            //cv.circle.median(x,150,100,100);
            //cv.median();
            //cv.circle.average(x,150,100,100);
            if(x>512){
                x=0;
            }
        }
        setInterval(tt, 10);
    }catch(e) {
        alert(e);
    }
}

document.getElementById("button").onclick= function(){
    xx+=5;
};