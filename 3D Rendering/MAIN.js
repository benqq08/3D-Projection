
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var Cam = {
    FOV: 70,
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
    ZSP:0,
    DOWN:false,

    W: false,
    A: false,
    S: false,
    D: false,
}





function rot(x,y,dir){
    let ret = []
    ret.push((x*Math.cos(dir))+(y*Math.sin(dir)))
    ret.push((y*Math.cos(dir))-(x*Math.sin(dir)))

    return ret
}

function rot2(x,y,z,xdir,ydir,zdir){
    
    let x3 = 0
    let y3 = 0
    let z3 = 0
    
    let v1 = rot(x,y,0-zdir)
    x3 = v1[0]
    y3 = v1[1]

    let v2 = rot(x3,z,0-ydir)
    x3 = v2[0]
    z3 = v2[1]

    let v3 = rot(z3,y3,xdir)
    z3 = v3[0]
    y3 = v3[1]

    return [x3,y3,z3]
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

function project(rX,rY,rZ,rX2,rY2,rZ2,xdir,ydir,zdir,dist){
    const X = rX + Cam.X
    const Y = rY + Cam.Y
    const Z = rZ + Cam.Z
    const X2 = rX2 + Cam.X
    const Y2 = rY2 + Cam.Y
    const Z2 = rZ2 + Cam.Z



    let finlv1 = rot2(X,Y,Z,xdir,ydir,zdir)
    let m1 = 240 / ((finlv1[2] + dist) * Math.tan(Cam.FOV/2))
    const RRx = finlv1[0]*m1
    const RRy = finlv1[1]*m1

    let finlv2 = rot2(X2,Y2,Z2,xdir,ydir,zdir)
    let m2 = 240 / ((finlv2[2] + dist) * Math.tan(Cam.FOV/2))

    if (m2 < 0 || m1 < 0){
        return
    }

    const RRx2 = finlv2[0]*m2
    const RRy2 = finlv2[1]*m2

    drawTo(RRx,RRy,RRx2,RRy2)


}

function voxel(xx,yy,zz,size){
    project((-1)+xx,(-1)+yy,(-1)+zz,(1)+xx,(-1)+yy,(-1)+zz     ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1)+xx,(1)+yy,(-1)+zz,(1)+xx,(1)+yy,(-1)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1)+xx,(1)+yy,(1)+zz,(1)+xx,(1)+yy,(1)+zz         ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1)+xx,(-1)+yy,(1)+zz,(1)+xx,(-1)+yy,(1)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1)+xx,(-1)+yy,(-1)+zz,(-1)+xx,(1)+yy,(-1)+zz     ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1)+xx,(-1)+yy,(-1)+zz,(1)+xx,(1)+yy,(-1)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1)+xx,(-1)+yy,(1)+zz,(-1)+xx,(1)+yy,(1)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1)+xx,(-1)+yy,(1)+zz,(1)+xx,(1)+yy,(1)+zz         ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1)+xx,(-1)+yy,(-1)+zz,(-1)+xx,(-1)+yy,(1)+zz     ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1)+xx,(-1)+yy,(-1)+zz,(1)+xx,(-1)+yy,(1)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1)+xx,(1)+yy,(-1)+zz,(1)+xx,(1)+yy,(1)+zz         ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1)+xx,(1)+yy,(-1)+zz,(-1)+xx,(1)+yy,(1)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
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

/*
canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

canvas.requestPointerLock()
*/
document.addEventListener('keydown', function(e) {
    if (e.which === 87 ) {
        inputs.W=true
    }
    if (e.which === 65 ) {
        inputs.A=true
    }
    if (e.which === 83 ) {
        inputs.S=true
    }
    if (e.which === 68 ) {
        inputs.D=true
    }
});
document.addEventListener('keyup', function(e) {
    if (e.which === 87 ) {
        inputs.W=false
    }
    if (e.which === 65 ) {
        inputs.A=false
    }
    if (e.which === 83 ) {
        inputs.S=false
    }
    if (e.which === 68 ) {
        inputs.D=false
    }
});


function loop() {
    context.fillStyle = `rgb(5,5,15)`
    context.fillRect(0,0,1000,1000)
    context.fillStyle = `rgb(200,200,205)`


    inputs.YSP = lerp(inputs.YSP,inputs.Y,.1)
    inputs.XSP = lerp(inputs.XSP,inputs.X,.1)
    if (inputs.DOWN==true){
        inputs.ZSP = lerp(inputs.ZSP,inputs.X,.04)
    }
    
    if (inputs.W==true){
        Cam.X += Math.cos(Cam.YDIR-90)/5
        Cam.Y -= Math.sin(Cam.XDIR)/5
    }
    if (inputs.S==true){
        Cam.X -= Math.cos(Cam.YDIR-90)/5
        Cam.Y += Math.sin(Cam.XDIR)/5
    }
    

    Cam.YDIR = inputs.XSP
    Cam.XDIR = inputs.YSP
    Cam.ZDIR = inputs.ZSP
    voxel(0,0,0,5);

    context.fillStyle = `rgb(100,220,100)`
    project(0,.2,0,0,2,0,Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    context.fillStyle = `rgb(100,100,220)`
    project(0,0,.2,0,0,2,Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    context.fillStyle = `rgb(220,100,100)`
    project(.2,0,0,2,0,0,Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    requestAnimationFrame(loop);
};


requestAnimationFrame(loop)




//bye :(
