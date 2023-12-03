//HelloCanvas.js
function main(){
    //Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    ctx.fillRect(0,0,800,800);
    context.clearRect(0, 0, canvas.clientWidth, canvas.height);
    canvas.style.backgroundColor = "red";

    //Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if(gl){
        console.log('Succeeded getting the rendering context for WebGL');
        return;
    }
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.5, 0.0, 1.0);

    //Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}