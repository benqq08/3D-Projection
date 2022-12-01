    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ///The matt shaker give me the matt shaker man! yeah pull that shirt up! shake that ass! yeah thats some matt ass right there///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var Cam = {
    FOV: 35,
    X:0,
    Y:0,
    Z:0,
    XDIR:0,
    YDIR:0,
    ZDIR:0,
}
var inputs = {
    X:0,
    Y:0,
    XSP:0,
    YSP:0,
    DOWN:false,
}
function lerp(a,b,c){
    return a+(b-a)*c
}
function drawTo(sx,sy,fx,fy){
    const dist = (Math.abs(fx-sx)+Math.abs(fy-sy))/2
    for (let i=0;i<dist;i++){
        context.fillRect(lerp(sx,fx,i/dist)+500,lerp(sy,fy,i/dist)+500,5,5)
    }
}
function project(X,Y,Z,X2,Y2,Z2){
    let x = (Math.sin(Cam.XDIR) * (X+Cam.X)) + ((Math.cos(Cam.XDIR) * (Z+Cam.Z)) * -1)
    let y = (((Math.cos(Cam.XDIR) * (X+Cam.X)) + (Math.sin(Cam.XDIR) * (Z+Cam.Z))) * Math.cos(Cam.YDIR)) + ((Y+Cam.Y) * Math.sin(Cam.YDIR))
    let z = (((Math.sin(Cam.XDIR) * (X+Cam.X)) + (Math.sin(Cam.XDIR) * (Z+Cam.Z))) * Math.cos(Cam.YDIR)) + ((Y+Cam.Y) * Math.cos(Cam.YDIR))
    
    let x2 = (Math.sin(Cam.XDIR) * (X2+Cam.X)) + ((Math.cos(Cam.XDIR) * (Z2+Cam.Z)) * -1)
    let y2 = (((Math.cos(Cam.XDIR) * (X2+Cam.X)) + (Math.sin(Cam.XDIR) * (Z2+Cam.Z))) * Math.cos(Cam.YDIR)) + ((Y2+Cam.Y) * Math.sin(Cam.YDIR))
    let z2 = (((Math.sin(Cam.XDIR) * (X2+Cam.X)) + (Math.sin(Cam.XDIR) * (Z2+Cam.Z))) * Math.cos(Cam.YDIR)) + ((Y2+Cam.Y) * Math.cos(Cam.YDIR))

    drawTo(x,y,x2,y2) //i am going to kill myself
}
document.addEventListener("mousemove", () => {
    inputs.X = event.clientX/100
    inputs.Y = event.clientY/100
});
document.addEventListener("mousedown", () => {
    inputs.DOWN = true
});
document.addEventListener("mouseup", () => {
    inputs.DOWN = false
});

function loop() {
    context.fillStyle = `rgb(5,5,15)`
    context.fillRect(0,0,1000,1000)
    context.fillStyle = `rgb(200,200,205)`

    //inputs.XSP = lerp(inputs.XSP,inputs.X,.1)
    //inputs.YSP = lerp(inputs.YSP,inputs.Y,.1)

    inputs.XSP += .063
    inputs.YSP += .043

    if (inputs.DOWN==true){
        Cam.X += (inputs.XSP-inputs.X)*2
        Cam.Y += (inputs.YSP-inputs.Y)*2
    }

        Cam.XDIR = inputs.XSP
        Cam.YDIR = inputs.YSP
    
   /*
    for(i=0;i<Points.length;i++){
        let newInd = i+1
        if ((i+1) >= Points.length){
            newInd = 0
        }
    }
    */
    project(-50,-50,-50,-50,50,-50);
    project(-50,50,-50,50,50,-50);
    project(50,50,-50,50,-50,-50);
    project(50,-50,-50,-50,-50,-50);

    project(-50,-50,50,-50,50,50);
    project(-50,50,50,50,50,50);
    project(50,50,50,50,-50,50);
    project(50,-50,50,-50,-50,50);

    project(-50,-50,-50,-50,-50,50);
    project(50,-50,-50,50,-50,50);
    project(50,50,-50,50,50,50);
    project(-50,50,-50,-50,50,50);
 
    context.fillStyle = `rgb(80,255,80)`
    project(0,10,0,0,110,0)
    context.fillStyle = `rgb(255,80,80)`
    project(10,0,0,110,0,0)
    context.fillStyle = `rgb(80,80,255)`
    project(0,0,10,0,0,110)

    requestAnimationFrame(loop);
};


requestAnimationFrame(loop)

