//helper functions, moved shorted 2D Drawings.js

function changeButtons(button){
    document.getElementById("LineButton").style.background='buttonface';
    document.getElementById("TriangleButton").style.background='buttonface';
    document.getElementById("QuadButton").style.background='buttonface';
    document.getElementById(button).style.background='#00b2b0';
  }
  
  //take array of quad vertecies, return somewhat sorted
  function sortVerts(vertTemp){
      var center = [0,0];
      var final_verts = [];
      for(var i = 0; i < 4; i++){
        center[0] += vertTemp[i][0];
        center[1] += vertTemp[i][1];
      }
      center[0] = center[0]/4;
      center[1] = center[1]/4;
      //console.log("center: " + center[0] + " " + center[1]);
    //nortWest
  
      for(var i = 0; i < vertTemp.length; i++){
        if(vertTemp[i][0] <= center[0] && vertTemp[i][1] >= center[1]){
          final_verts.push(vertTemp[i]);
          vertTemp.splice(i, 1);
        }
      }
  
    //southWEst
      for(var i = 0; i< vertTemp.length; i++){
        if(vertTemp[i][0] <= center[0] && vertTemp[i][1] <= center[1]){
          final_verts.push(vertTemp[i]);
          vertTemp.splice(i, 1);
        }
      }
  
    //northEAst
      for(var i = 0; i<vertTemp.length; i++){
        if(vertTemp[i][0] >= center[0] && vertTemp[i][1] >= center[1]){
          final_verts.push(vertTemp[i]);
          vertTemp.splice(i, 1);
        }
      }
  
      //any remaining points
    while(vertTemp.length > 0){
      final_verts.push(vertTemp[0]);
      vertTemp.splice(0, 1);
    }
  
        return final_verts;
  
  }
  
  //take a multi dimensional array, return a 1d array
  /**
   * Converts 1D or 2D array of num's 'v' into a 1D Float32Array.
   * @param {num[] | num[][]} v
   * @returns {Float32Array}
   */
  function flatten(v){
      var n = v.length;
      var elemsAreArrays = false;
  
      if (Array.isArray(v[0])) {
          elemsAreArrays = true;
          n *= v[0].length;
      }
  
      var floats = new Float32Array(n);
  
      if (elemsAreArrays) {
          var idx = 0;
          for (var i = 0; i < v.length; ++i) {
              for (var j = 0; j < v[i].length; ++j) {
                  floats[idx++] = v[i][j];
              }
          }
      }
      else {
          for (var i = 0; i < v.length; ++i) {
              floats[i] = v[i];
          }
      }
  
      return floats;
  }