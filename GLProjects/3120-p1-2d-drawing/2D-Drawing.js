
var canvasDraw = {lineDraw: 0, triangleDraw: 1, quadDraw:2, screenClear: 3, None: 4};

var select = [];
var selectIndex = -1; 

var finalPoint = [null, null];

var currentCanvasDraw = canvasDraw.lineDraw;


var vBufferPnt;
var vBufferLine;
var vBufferTri;
var vBufferQuad;

var points = [], vertLines = [], vertTri = [], vertQuad = [];
var selectPoints = []; //vertecies of the select object, used for highlighting
var lineColor = [], colorTri = [],   colorQuad = [];
var drawingOrder = [];
var numbPoints = 0;// cnt num of points clicked for new line
var currColor = [0,100,0];

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShadersFromID(gl, "vertex-shader", "fragment-shader")) {
        console.log('Failed to intialize shaders.');
        return;
    }

    vBufferPnt = gl.createBuffer();
    if (!vBufferPnt) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    vBufferLine = gl.createBuffer();
    if (!vBufferLine) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    vBufferTri = gl.createBuffer();
    if(!vBufferTri){
      console.log("Failed to create triangle buffer");
      return -1;
    }

    vBufferQuad = gl.createBuffer();
    if(!vBufferQuad){
      console.log("Failed to create quad buffer");
      return -1;
    }
    
    gl.clearColor(0, 0, 0, 1);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    updateColorPreview(currColor);  

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    document.getElementById("LineButton").addEventListener(
            "click",
            function () {
              if(currentCanvasDraw != canvasDraw.lineDraw){
                undrawnClear();
                objDraw(gl,a_Position, u_FragColor);
              }
                currentCanvasDraw = canvasDraw.lineDraw;
                changeButtons("LineButton");
            });
    document.getElementById("TriangleButton").addEventListener(
            "click",
            function () {
              if(currentCanvasDraw != canvasDraw.triangleDraw){
                undrawnClear();
                objDraw(gl,a_Position, u_FragColor);
              }
                currentCanvasDraw = canvasDraw.triangleDraw;
                changeButtons("TriangleButton");
            });
            
    document.getElementById("QuadButton").addEventListener(
            "click",
            function(){
            if(currentCanvasDraw != canvasDraw.quadDraw){
              undrawnClear(); 
              objDraw(gl,a_Position, u_FragColor);  
              }
                changeButtons("QuadButton");
                currentCanvasDraw = canvasDraw.quadDraw;
          });
    document.getElementById("DeleteButton").addEventListener(
      "click",
      function(){
        if(select[selectIndex].type == "line"){
          vertLines.splice(select[selectIndex].index, 2);
          var i = select[selectIndex].index / 2;
          lineColor.splice(i, 1);
          var c = 0;
          
          while( i >= 0 && c < drawingOrder.length){
            if(drawingOrder[c] == "line"){
              if(i == 0){
                drawingOrder.splice(c, 1);
                i--;
              }
              i--;
            }
            c++;
          }
        }
        if(select[selectIndex].type == "triangle"){
          vertTri.splice(select[selectIndex].index, 3);
          var i = select[selectIndex].index / 3;
          colorTri.splice(i, 1);
          var c = 0;
            
            while( i >= 0 && c < drawingOrder.length){
              if(drawingOrder[c] == "triangle"){
                if(i == 0){
                  drawingOrder.splice(c, 1);
                  i--;
                }
                i--;
              }
              c++;
            }
        }
        if(select[selectIndex].type == "quad"){
          vertQuad.splice(select[selectIndex].index, 5);
          var i = select[selectIndex].index / 5;
          colorQuad.splice(i, 1);
          var c = 0;
          
          while( i >= 0 && c < drawingOrder.length){
            if(drawingOrder[c] == "quad"){
              if(i == 0){
                drawingOrder.splice(c, 1);
                i--;
              }
              i--;
            }
            c++;
          }
        }
      selectPoints.splice(0, selectPoints.length);
      objDraw(gl,a_Position, u_FragColor);
      });
    document.getElementById("screenClearButton").addEventListener(
            "click",
            function () {
                currentCanvasDraw = canvasDraw.screenClear;
                
                select.splice(0, select.length);
                selectIndex = -1;
                finalPoint = [null, null];
                undrawnClear();
                selectPoints.splice(0,selectPoints.length);
                vertLines.splice(0, vertLines.length);
                vertTri.splice(0, vertTri.length);
                vertQuad.splice(0, vertQuad.length);
                lineColor.splice(0, lineColor.length);
                colorTri.splice(0, colorTri.length);
                colorQuad.splice(0, colorQuad.length);
                drawingOrder.splice(0, drawingOrder.length);
                gl.clear(gl.COLOR_BUFFER_BIT);
                currentCanvasDraw = canvasDraw.lineDraw;
                changeButtons("LineButton");
            });
    
    document.getElementById("RedScale").addEventListener(
            "input",
            function () {
              currColor[0] = document.getElementById("RedScale").value;
                if(select.length > 0){
                  colorUpdate();
                }
                updateColorPreview(currColor);
                objDraw(gl,a_Position, u_FragColor);
            });
    document.getElementById("GreenScale").addEventListener(
            "input",
            function () {
              currColor[1] = document.getElementById("GreenScale").value;
              if(select.length > 0){
                colorUpdate();
              }
                updateColorPreview(currColor);
                objDraw(gl,a_Position, u_FragColor);
            });
    document.getElementById("BlueScale").addEventListener(
            "input",
            function () {
              currColor[2] = document.getElementById("BlueScale").value;
              if(select.length > 0){
                colorUpdate();
              }
                updateColorPreview(currColor);
                objDraw(gl,a_Position, u_FragColor);
            });
    
    slideUpdate(currColor);
    
    canvas.addEventListener(
            "mousedown",
            function (ev) {
                handleMouseDown(ev, gl, canvas, a_Position, u_FragColor);
                });
}

function handleMouseDown(ev, gl, canvas, a_Position, u_FragColor) {
    selectPoints = [];
    select = [];
    var x = ev.clientX; 
    var y = ev.clientY; 
    var rect = ev.target.getBoundingClientRect();
    
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);


if(ev.which == 1){
    if (currentCanvasDraw !== canvasDraw.None) {
        
        points.push([x, y]);
    }

    
    switch (currentCanvasDraw) {
        case canvasDraw.lineDraw:
           
            if (numbPoints < 1) {
               
                vertLines.push([x, y]);
                numbPoints++;
            }
            else {
                
                vertLines.push([x, y]); 
                lineColor.push(currColor.slice()); 
                    drawingOrder.push("line");  
                numbPoints = 0;
                points.length = 0;
            }
            break;
      case canvasDraw.triangleDraw:
        if(numbPoints < 2){
          vertTri.push([x, y]);
          numbPoints++
        }
        else{
          vertTri.push([x, y]);
          colorTri.push(currColor.slice());
          drawingOrder.push("triangle");
          numbPoints = 0;
          points.length = 0;
        }
        break;
      case canvasDraw.quadDraw:
      if(numbPoints < 3){
        vertQuad.push([x, y]);
        numbPoints++
      }
      else{
        var vertTemp = []; 
        for(var i = 0; i<3; i++)
        {
          vertTemp.push(vertQuad[vertQuad.length-1]);
          vertQuad.pop();
        }
        vertTemp.push([x, y]);
        vertTemp = sortVerts(vertTemp); 
        for(var i = 0; i<4; i++){
          vertQuad.push(vertTemp[i]);
        }
        vertQuad.push(vertTemp[0]);
        for(var i = 0; i<4; i++){
          vertTemp.pop();
        }
        colorQuad.push(currColor.slice());
        numbPoints = 0;
        points.length = 0;
        drawingOrder.push("quad");
      }
  }

}
  
  if(ev.which == 3){
    undrawnClear(); 
    if(finalPoint[0] == x && finalPoint[1] == y){ 
      selectIndex = (selectIndex + 1 ) % select.length; 
    }
    else{
      select.splice(0, select.length);
      finalPoint[0] = x;
      finalPoint[1] = y;
      
      for(var i = 0; i < vertLines.length; i+=2 ){
        if(pointLineDist([x,y], vertLines[i],vertLines[i+1]) < .03){
          select.push( {"type":"line", "index":i});
        }
      }
      var bcc = [] ;
      for(var i = 0; i<vertTri.length; i+=3){
        bcc = barycentric(vertTri[i], vertTri[i+1],vertTri[i+2], [x,y]);
        if(inside(bcc[0],bcc[1], bcc[2])){
          select.push( {"type":"triangle", "index":i});
        }
      }
      for(var i =0; i < vertQuad.length; i+=5){
        
        bcc = barycentric(vertQuad[i], vertQuad[i+1],vertQuad[i+2], [x,y]);
        if(inside(bcc[0],bcc[1],bcc[2])){
          select.push( {"type":"quad", "index":i});
        }
        else{
          bcc = barycentric(vertQuad[i+1], vertQuad[i+2],vertQuad[i+3], [x,y]);
          if(inside(bcc[0],bcc[1],bcc[2])){
            select.push( {"type":"quad", "index":i});
          }
          else{
            bcc = barycentric(vertQuad[i+2], vertQuad[i+3],vertQuad[i+4], [x,y]);
            if(inside(bcc[0],bcc[1],bcc[2])){
              select.push( {"type":"quad", "index":i});
            }
          }
        }
      }
      if(select.length > 0)
          selectIndex = 0;
    }
    if(select.length > 0){
      
      selectPoints = [];
      if(select[selectIndex].type == "line" ){
        selectPoints.push(vertLines[select[selectIndex].index]);
        selectPoints.push(vertLines[select[selectIndex].index+1]);
       
        slideUpdate(lineColor[select[selectIndex].index / 2]);
      }
      if(select[selectIndex].type == "triangle"){
        selectPoints.push(vertTri[select[selectIndex].index]);
        selectPoints.push(vertTri[select[selectIndex].index+1]);
        selectPoints.push(vertTri[select[selectIndex].index+2]);
        
        slideUpdate(colorTri[select[selectIndex].index / 3]);
      }
      if(select[selectIndex].type == "quad"){
        selectPoints.push(vertQuad[select[selectIndex].index]);
        selectPoints.push(vertQuad[select[selectIndex].index+1]);
        selectPoints.push(vertQuad[select[selectIndex].index+2]);
        selectPoints.push(vertQuad[select[selectIndex].index+3]);
        
        slideUpdate(colorQuad[select[selectIndex].index / 5]);
      }


    }
  }
  objDraw(gl,a_Position, u_FragColor);
}

function undrawnClear(){
  if(numbPoints > 0){
    switch(currentCanvasDraw){
      case canvasDraw.lineDraw:
          vertLines.splice(vertLines.length - numbPoints, numbPoints);
          break;
      case canvasDraw.triangleDraw:
            vertTri.splice(vertTri.length - numbPoints, numbPoints);
            break;
      case canvasDraw.quadDraw:
            vertQuad.splice(vertQuad.length - numbPoints, numbPoints);
            break;
    }
  }
  points.splice(0, points.length);
  numbPoints = 0;
}

function objDraw(gl, a_Position, u_FragColor) {
    var L = 0; 
    var T = 0; 
    var Q = 0; 

    gl.clear(gl.COLOR_BUFFER_BIT);

   
   for(var i = 0; i<drawingOrder.length; i++){
      if(drawingOrder[i] == "line"){
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferLine);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertLines), gl.STATIC_DRAW);
      
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, lineColor[L][0]/100, lineColor[L][1]/100, lineColor[L][2]/100, 1.0);
        gl.drawArrays(gl.LINES, L*2, 2);
        L++;
      }
      if(drawingOrder[i] == "triangle"){
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTri);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertTri), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, colorTri[T][0]/100, colorTri[T][1]/100, colorTri[T][2]/100, 1.0);
        gl.drawArrays(gl.TRIANGLES, T*3, 3);
        T++;
      }
      if(drawingOrder[i] == "quad"){
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferQuad);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertQuad), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, colorQuad[Q][0]/100, colorQuad[Q][1]/100, colorQuad[Q][2]/100, 1.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, Q*5, 5);
        Q++;
      }
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferPnt);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, points.length);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferPnt);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(selectPoints), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, selectPoints.length);
}

function slideUpdate(color){
  currColor = color.slice();
  document.getElementById("RedScale").value = currColor[0];
  document.getElementById("GreenScale").value = currColor[1];
  document.getElementById("BlueScale").value = currColor[2];
  updateColorPreview(currColor);
}

function colorUpdate(){
  if(select.length > 0){
      if(select[selectIndex].type == "line"){
       lineColor.splice([select[selectIndex].index / 2], 1, currColor.slice());
      }
      else if(select[selectIndex].type == "triangle"){
        colorTri.splice([select[selectIndex].index / 3], 1, currColor.slice());
      }
      else if(select[selectIndex].type == "quad"){
        colorQuad.splice([select[selectIndex].index / 5], 1, currColor.slice());
      }
  }
}