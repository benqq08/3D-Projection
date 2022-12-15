//hi :)
 
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
 
var Cam = {
    FOV: 70,
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
    MD:false,
 
 
    UP:false,
    DOWN:false,  
    LEFT:false,
    RIGHT:false,  
 
    W: false,
    A: false,
    S: false,
    D: false,
    Q: false,
    E: false,
}
 
let ClVoxel = false
let voxCol = [100,100,100]
var VOXELS = []
var SCREENVOXELS = []
 

let Gate = new Image();
Gate.src = "file://s014lss01/Studenthome$/KSS/986883/Documents/comp%2011/3D-Projection-main/3D%20Rendering/Key.png"

function print(val){
    console.log(val)
}

function max(val,max){
    var xx = val
    if (xx > max){
        xx = max
    }
    return xx
}
function min(val,min){
    var xx = val
    if (xx < min){
        xx = min
    }
    return xx
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
    const dist = (Math.abs(fx-sx)+Math.abs(fy-sy))
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
    var RRx = finlv1[0]*m1
    var RRy = finlv1[1]*m1
 
    let finlv2 = rot2(X2,Y2,Z2,xdir,ydir,zdir)
    let m2 = 240 / ((finlv2[2] + dist) * Math.tan(Cam.FOV/2))
 
    if (m2 < 0 || m1 < 0){
        return
    }
 
    var RRx2 = finlv2[0]*m2
    var RRy2 = finlv2[1]*m2
 
 
    RRx = max(RRx,850)
    RRx2 = max(RRx2,850)
    RRx = min(RRx,-850)
    RRx2 = min(RRx2,-850)
 
    RRy = max(RRy,850)
    RRy2 = max(RRy2,850)
    RRy = min(RRy,-850)
    RRy2 = min(RRy2,-850)
 
    drawTo(RRx,RRy,RRx2,RRy2)
    return [RRx,RRy]
 
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
 
function voxel(xx,yy,zz,size,scale){
    project((-1*scale)+xx,(-1*scale)+yy,(-1*scale)+zz,(1*scale)+xx,(-1*scale)+yy,(-1*scale)+zz     ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1*scale)+xx,(1*scale)+yy,(-1*scale)+zz,(1*scale)+xx,(1*scale)+yy,(-1*scale)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1*scale)+xx,(1*scale)+yy,(1*scale)+zz,(1*scale)+xx,(1*scale)+yy,(1*scale)+zz         ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1*scale)+xx,(-1*scale)+yy,(1*scale)+zz,(1*scale)+xx,(-1*scale)+yy,(1*scale)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1*scale)+xx,(-1*scale)+yy,(-1*scale)+zz,(-1*scale)+xx,(1*scale)+yy,(-1*scale)+zz     ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1*scale)+xx,(-1*scale)+yy,(-1*scale)+zz,(1*scale)+xx,(1*scale)+yy,(-1*scale)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1*scale)+xx,(-1*scale)+yy,(1*scale)+zz,(-1*scale)+xx,(1*scale)+yy,(1*scale)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1*scale)+xx,(-1*scale)+yy,(1*scale)+zz,(1*scale)+xx,(1*scale)+yy,(1*scale)+zz         ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1*scale)+xx,(-1*scale)+yy,(-1*scale)+zz,(-1*scale)+xx,(-1*scale)+yy,(1*scale)+zz     ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1*scale)+xx,(-1*scale)+yy,(-1*scale)+zz,(1*scale)+xx,(-1*scale)+yy,(1*scale)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((1*scale)+xx,(1*scale)+yy,(-1*scale)+zz,(1*scale)+xx,(1*scale)+yy,(1*scale)+zz         ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
    project((-1*scale)+xx,(1*scale)+yy,(-1*scale)+zz,(-1*scale)+xx,(1*scale)+yy,(1*scale)+zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
 
    var closest = project(xx,yy,zz,xx,yy,zz       ,Cam.XDIR,Cam.YDIR,Cam.ZDIR,size)
 
    SCREENVOXELS.push(closest)
 
}
 
 
 
document.addEventListener("mousemove", () => {
    inputs.X = event.clientX
    inputs.Y = event.clientY
});
let vox = "Line"
document.addEventListener("mousedown", () => {
    inputs.MD = true
    if (inputs.Y < 825){
        VOXELS.push([(Math.floor(-Cam.X/2)*2),(Math.floor(-Cam.Y/2)*2),(Math.floor(-Cam.Z/2)*2),5,vox,false,0])
    }
    console.log(inputs.Y)
 
});
document.addEventListener("mouseup", () => {
    inputs.MD = false
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
    if (e.which === 38 ) {
        inputs.UP=true
    }
    if (e.which === 40 ) {
        inputs.DOWN=true
    }
    if (e.which === 37 ) {
        inputs.LEFT=true
    }
    if (e.which === 39 ) {
        inputs.RIGHT=true
    }
    if (e.which === 81 ) {
        inputs.Q=true
    }
    if (e.which === 69 ) {
        inputs.E=true
    }
    if (e.which === 90 ) {
        for (let i=0; i<VOXELS.length;i++){
            const vox = VOXELS[i]
            if (vox[0]==(Math.floor(-Cam.X/2)*2) && vox[1]==(Math.floor(-Cam.Y/2)*2) && vox[2]==(Math.floor(-Cam.Z/2)*2)){
                console.log("ccok")
                removeItemOnce(VOXELS,vox)
            }
        }
    }
    if (e.which === 70 ) {
        if (vox=="Line"){
            vox="Timer"
            voxCol = [150,175,150]
        }
        else if (vox=="Timer"){
            vox="Source"
            voxCol = [100,0,0]
        }
        else if (vox=="Source"){
            vox="Or"
            voxCol = [100,255,100]
        }
        else if (vox=="Or"){
            vox="And"
            voxCol = [255,100,100]
        }
        else if (vox=="And"){
            vox="Xor"
            voxCol = [25,255,25]
        }
        else if (vox=="Xor"){
            vox="Xand"
            voxCol = [255,25,25]
        }
        else if (vox=="Xand"){
            vox="Not"
            voxCol = [35,35,255]
        }
        else if (vox=="Not"){
            vox="Switch"
            voxCol = [255,76,207]
        }
        else if (vox=="Switch"){
            vox="Line"
            voxCol = [100,100,100]
        }
    }
    /*
        if (vox[4]=="Line"){
            context.fillStyle = `rgb(100,100,100)`
        }
        else if (vox[4]=="Timer"){
            context.fillStyle = `rgb(150,175,150)`
        }
        else if (vox[4]=="Source"){
            context.fillStyle = `rgb(100,0,0)`
        }

        else if (vox[4]=="Or"){
            context.fillStyle = `rgb(100,255,100)`
        }
        else if (vox[4]=="And"){
            context.fillStyle = `rgb(255,100,100)`
        }

        else if (vox[4]=="Xor"){
            context.fillStyle = `rgb(25,255,25)`
        }
        else if (vox[4]=="Xand"){
            context.fillStyle = `rgb(255,25,25)`
        }

        else if (vox[4]=="Not"){
            context.fillStyle = `rgb(35,35,255)`
        }
    */


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
    if (e.which === 38 ) {
        inputs.UP=false
    }
    if (e.which === 40 ) {
        inputs.DOWN=false
    }
    if (e.which === 37 ) {
        inputs.LEFT=false
    }
    if (e.which === 39 ) {
        inputs.RIGHT=false
    }
    if (e.which === 81 ) {
        inputs.Q=false
    }
    if (e.which === 69 ) {
        inputs.E=false
    }
 
});
 
 
function loop() {
    context.fillStyle = `rgb(5,5,15)`
    context.fillRect(0,0,1000,1000)
    context.fillStyle = `rgb(200,200,205)`
    SCREENVOXELS = []
 
    inputs.YSP = lerp(inputs.YSP,inputs.Y,.1)
    inputs.XSP = lerp(inputs.XSP,inputs.X,.1)
   
    if (inputs.W==true){
        Cam.X += Math.sin(Cam.YDIR)/7
        Cam.Z += Math.cos(Cam.YDIR)/7
    }
    if (inputs.S==true){
        Cam.X -= Math.sin(Cam.YDIR)/7
        Cam.Z -= Math.cos(Cam.YDIR)/7
    }
 
    if (inputs.A==true){
        Cam.X += Math.sin(Cam.YDIR+(Math.PI/2))/7
        Cam.Z += Math.cos(Cam.YDIR+(Math.PI/2))/7
    }
    if (inputs.D==true){
        Cam.X -= Math.sin(Cam.YDIR+(Math.PI/2))/7
        Cam.Z -= Math.cos(Cam.YDIR+(Math.PI/2))/7
    }
 
    if (inputs.E==true){
        Cam.Y -= .1
    }
    if (inputs.Q==true){
        Cam.Y += .1
    }
 
 
    if (inputs.LEFT==true){
        Cam.YDIR += .025
    }
    if (inputs.RIGHT==true){
        Cam.YDIR -= .025
    }
 
    if (inputs.UP==true){
        Cam.XDIR -= .025
 
    }
    if (inputs.DOWN==true){
        Cam.XDIR += .025
    }
 
 
 
 
    for(let i=0;i<VOXELS.length;i++){
        const vox = VOXELS[i]
        vox[6]-= .5
        vox[5] = false
        if (vox[4]=="Line"){
            context.fillStyle = `rgb(100,100,100)`
        }
        else if (vox[4]=="Timer"){
            context.fillStyle = `rgb(150,175,150)`
        }
        else if (vox[4]=="Source"){
            context.fillStyle = `rgb(100,0,0)`
        }

        else if (vox[4]=="Or"){
            context.fillStyle = `rgb(100,255,100)`
        }
        else if (vox[4]=="And"){
            context.fillStyle = `rgb(255,100,100)`
        }

        else if (vox[4]=="Xor"){
            context.fillStyle = `rgb(25,255,25)`
        }
        else if (vox[4]=="Xand"){
            context.fillStyle = `rgb(255,25,25)`
        }

        else if (vox[4]=="Not"){
            context.fillStyle = `rgb(35,35,255)`
        }
        
        else if (vox[4]=="Switch"){
            context.fillStyle = `rgb(255,76,207)`
        }

            for(let indx = 0; indx<VOXELS.length; indx++){
                if (i!=indx){
                    if (vox[4]=="Line"){
                        const newvox=VOXELS[indx]
                    
                        if (newvox[5]==true || newvox[4]=="Source"){
                            
                            if(Math.abs((newvox[0])-(vox[0])) <= 2){
                                if(Math.abs((newvox[1])-(vox[1])) <= 2){
                                    if(Math.abs((newvox[2])-(vox[2])) <= 2){
                                        context.fillStyle = `rgb(255,255,255)`
                                        vox[5]=true
                                        newvox[5]=true
                                    }
                                }    
                            }
                        }
                }
                else if (vox[4]=="Timer"){
                    const newvox=VOXELS[indx]
                    
                    vox[6] = max(vox[6],25)
                    vox[6] = min(vox[6],-1)
                    console.log(vox[6])
                    if (newvox[5]==true || newvox[4]=="Source"){
                        
                        if(Math.abs((newvox[0])-(vox[0])) <= 2){
                            if(Math.abs((newvox[1])-(vox[1])) <= 2){
                                if(Math.abs((newvox[2])-(vox[2])) <= 2){
                                    vox[6]+= 1
                                    if (vox[6]>20){
                                        context.fillStyle = `rgb(255,255,255)`
                                        vox[5]=true
                                        newvox[5]=true
                                        
                                    }
                                    
                                }

                            }
 
                        }

                    }
                }
            }
        }
        voxel(vox[0],vox[1],vox[2],vox[3],1)
       
    }  
    /*
    context.fillStyle = `rgb(100,220,100)`
    project(0,.2,0,0,2,0,Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    context.fillStyle = `rgb(100,100,220)`
    project(0,0,.2,0,0,2,Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    context.fillStyle = `rgb(220,100,100)`
    project(.2,0,0,2,0,0,Cam.XDIR,Cam.YDIR,Cam.ZDIR,5)
    */
 
    context.fillStyle = `rgba(255,255,255.1)`
    voxel((Math.floor(-Cam.X/2)*2),(Math.floor(-Cam.Y/2)*2),(Math.floor(-Cam.Z/2)*2),5,1.1);
 
 
    context.fillStyle = `rgb(25,25,35)`
    context.fillRect(0,825,1000,1000)
 
 
    context.fillStyle = `rgb(${voxCol[0]},${voxCol[1]},${voxCol[2]})`
 
 
    context.font = "50px Arial";
    context.fillText("Voxel Mode: " + vox,150,950)
    context.drawImage(Gate,-200,500,750,550)
    requestAnimationFrame(loop);
};
 
 
requestAnimationFrame(loop)
 
 
 
 
//bye :(

