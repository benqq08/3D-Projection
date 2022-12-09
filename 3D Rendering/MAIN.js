//hi :)

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var Cam = {
    FOV: .5,
    X:0,
    Y:0,
    Z:0,
    XDIR:Math.PI,
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
    const dist = (Math.abs(fx-sx)+Math.abs(fy-sy))/6.8
    for (let i=0;i<dist;i++){
        context.fillRect(lerp(sx,fx,i/dist)+500,lerp(sy,fy,i/dist)+500,5,5)
    }
}

function drawTri(p1,p2,p3){

}


function fillTri(P1,P2,P3,xdir,ydir,zdir,dist){
    let p1 = project(P1[0],P1[1],P1[2],P1[3],P1[4],P1[5],xdir,ydir,zdir,dist)
    let p2 = project(P2[0],P2[1],P2[2],P2[3],P2[4],P2[5],xdir,ydir,zdir,dist)
    let p3 = project(P3[0],P3[1],P3[2],P3[3],P3[4],P3[5],xdir,ydir,zdir,dist)

    drawTri(p1,p2,p3)
}

function project(rX,rY,rZ,rX2,rY2,rZ2,xdir,ydir,zdir,dist){
    const X = rX + Cam.X
    const Y = rY + Cam.Y
    const Z = rZ + Cam.Z
    const X2 = rX2 + Cam.X
    const Y2 = rY2 + Cam.Y
    const Z2 = rZ2 + Cam.Z

    let finlv1 = rot2(X,Y,Z,xdir,ydir,zdir)
    let m1 = 240 / ((finlv1[2] + dist) * Math.abs(Cam.FOV/2))
    const RRx = finlv1[0]*m1
    const RRy = finlv1[1]*m1

    let finlv2 = rot2(X2,Y2,Z2,xdir,ydir,zdir)
    let m2 = 240 / ((finlv2[2] + dist) * Math.abs(Cam.FOV/2))

    if (m2 < 0 || m1 < 0){
        return
    }

    const RRx2 = finlv2[0]*m2
    const RRy2 = finlv2[1]*m2

    return [RRx,RRy,RRx2,RRy2]


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

    Cam.XDIR += .011
    Cam.YDIR += .02
    Cam.ZDIR += .025
    //voxel(0,0,0,5);

    
    fillTri([0,0,0,0,1,0],[0,1,0,1,1,0],[1,1,0,0,0,0],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,0,0,1,0,0],[1,0,0,1,1,0],[1,1,0,0,0,0],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,0,1,0,1,1],[0,1,1,1,1,1],[1,1,1,0,0,1],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,0,1,1,0,1],[1,0,1,1,1,1],[1,1,1,0,0,1],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,0,0,0,0,1],[0,0,1,0,1,1],[0,1,1,0,0,0],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,0,0,0,1,0],[0,1,0,0,1,1],[0,1,1,0,0,0],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    
    fillTri([1,0,0,1,1,1],[1,1,1,1,1,0],[1,1,0,1,0,0],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    
    fillTri([1,1,1,1,0,1],[1,0,1,1,0,0],[1,0,0,1,1,1],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    
    fillTri([0,1,0,1,1,0],[1,1,0,1,1,1],[1,1,1,0,1,0],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,1,0,0,1,1],[0,1,0,1,1,1],[1,1,1,0,1,1],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,0,0,1,0,0],[1,0,0,1,0,1],[1,0,1,0,0,0],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)

    fillTri([0,0,0,0,0,1],[0,0,0,1,0,1],[1,0,1,0,0,1],Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    
    requestAnimationFrame(loop);
};


requestAnimationFrame(loop)




//bye :(
