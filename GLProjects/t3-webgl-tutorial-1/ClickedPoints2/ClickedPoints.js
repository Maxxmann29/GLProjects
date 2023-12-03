//ClickedPoints.js
//Vertex shader program

var numPolygons = 0;
var numIndices = [0];
var start = [0];

var VSHADER_SOURCE=
'attribute vec4 a_Position;\n' + 
'void main(){\n' +
' gl_PointSize = 10.0;\n' +
'}\n';

//Fragment shader program
var FSHADER_SOURCE = 
'void main() {\n' +
' gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n'  + //Set the color
'}\n';

function main(){
    //Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    //Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //Initialize shaders
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('Failed to initialize shaders.')
        return;
    }

    //Get the storage location of a_Position variable
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position < 0){
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    //Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev){click(ev,gl,canvas,a_Position);};

    //Pass the vertex position to attribute variable
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    //Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; //The array for a mouse press
function click(ev,gl,canvas,a_Position){
    var x = ev.clientX; //x coordinate of a mouse pointer
    var y = ev.clientY; //y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x-rect.left)-canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    //Store the coordinates tp g_points array
    g_points.push(x);
    g_points.push(y);

    //Clear <canvas>

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0;i < len;i+=2){
        //Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

        //Draw a point
        gl.drawArrays(gl.POINTS,0,1);
    }
}
canvas.addEventListener("mousedown", function() {
    var t = vec2(2*event.clientX/canvas.width-1, 2*(canvas.height-event.clientY)/canvas.height-1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(t));

    t = vec4(colors[cIndex]);
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*index, flatten(t));
    
    index++;
    numIndices[numPolygons]++;
});

getElementById("Button1").onclick = function(){
    numPolygons++;
    numIndices[numPolygons] = 0;
    start[numPolygons] = 0;
    start[numPolygons] = index;
    render();
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (var i = 0; i < numPolygons; i++){
        gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
    }
}
