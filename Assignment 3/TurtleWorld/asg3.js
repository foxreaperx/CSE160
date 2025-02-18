// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  //uniform mat4 u_GlobalTranslateMatrix;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform int u_whichTexture;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;


  void main() {
    if(u_whichTexture == 0) {  
      gl_FragColor =  u_FragColor;
    } else if(u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if(u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }else if(u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }else if(u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if(u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    }
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_whichTexture;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let camera;
let world;
//let u_GlobalTranslateMatrix;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;

const SKY = 2;
const DIRT = 3;
const GRASS_SIDE = 4;
const GRASS_TOP = 5;
const PLANK = 6;

let g_animationActive = true;
let g_animationPoke = false;

var g_flAngle = 0.0;
var g_frAngle = 0.0;
var g_blAngle = 0.0;
var g_brAngle = 0.0;
var g_flLowerAngle = 0.0;
var g_frLowerAngle = 0.0;
var g_blLowerAngle = 0.0;
var g_brLowerAngle = 0.0;
var g_headAngle = 10.0;
  
  let g_cameraAngleY = 0;
  let g_cameraAngleX = 0;
  let g_deltaX = 0;
  let g_deltaY = 0;

  function setUpWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);

    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
  }
  gl.enable(gl.DEPTH_TEST);
  //gl.enable(gl.CULL_FACE);
}

function initTextures() {
  let image0 = new Image();
  if(!image0) {
    console.log('Failed to create image object');
    return false;
  }

  image0.onload = function() { loadTexture0(image0); };
  image0.src = 'dirt.jpg';

  let image1 = new Image();
  if(!image1) {
    console.log('Failed to create image object');
    return false;
  }

  image1.onload = function() { loadTexture1(image1); };
  image1.src = 'grasstop.jpg';

  let image2 = new Image();
  if(!image2) {
    console.log('Failed to create image object');
  }

  image2.onload = function() { loadTexture2(image2); };
  image2.src = 'grassSide.jpg';

  let image3 = new Image();
  if(!image3) {
    console.log('Failed to create image object');
  }

  image3.onload = function() { loadTexture3(image3); };
  image3.src = 'sand_dark.jpg';

  let image4 = new Image();
  if(!image4) {
    console.log('Failed to create image object');
  }

  image4.onload = function() { loadTexture4(image4); };
  image4.src = 'sand.jpg';

  return true;
}

function loadTexture0(image) {
  let texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler0, 0);

}

function loadTexture1(image) {
  let texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler1, 1);

}

function loadTexture2(image) {
  let texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler2, 2);

}

function loadTexture3(image) {
  let texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler3, 3);

}

function loadTexture4(image) {
  let texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler4, 4);

}



function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }


    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if(!a_UV) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0) {
    console.log('Failed to create sampler0 object');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1) {
    console.log('Failed to create sampler1 object');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2) {
    console.log('Failed to create sampler2 object');
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if(!u_Sampler3) {
    console.log('Failed to create sampler3 object');
    return false;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if(!u_Sampler4) {
    console.log('Failed to create sampler4 object');
    return false;
  }


  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log('Failed to create texture option object');
    return false;
  }

  let m = new Matrix4();
  camera = new Camera();
  world = new World();
  camera.eye = new Vector3([0, 1, 2]);
  camera.at = new Vector3([0, 0, -100]);
  camera.up = new Vector3([0, 1, 0]);
  
  gl.uniformMatrix4fv(u_ModelMatrix, false, m.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, m.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, m.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, m.elements);

  //console.log("HI I GOT HERE");

  }


function addActionsForHtmlUI(){
  document.getElementById('Fancy').onclick = function() { world.nice_looking = true;};
  document.getElementById('Plain').onclick = function() { world.nice_looking = false;};
  canvas.onmousemove = function(ev) {
    let [x, y] = convertCoordinatesEventToGL(ev);
    if(ev.buttons == 1) {
      g_cameraAngleY -= (x - g_deltaX) * 120;
      g_cameraAngleX -= (y - g_deltaY) * 120;
      g_deltaX = x;
      g_deltaY = y;
    } else {
      g_deltaX = x;
      g_deltaY = y;
    }
  }


   // mouse events
   canvas.onclick = function(ev) {
    if(!document.pointerLockElement) {
      canvas.requestPointerLock();
    }else{
      if(ev.button == 0) {
        world.placeBlock();
      } else if(ev.button == 2) {
        world.removeBlock();
      }
    }
  }
  document.addEventListener('pointerlockchange', function(ev) {
    

    if(document.pointerLockElement === canvas) {
      canvas.onmousemove = (ev) => rotateCamera(ev);
    } else {
      canvas.onmousemove = null;
    }
  });
  
}



var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
  
function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  

  renderAllShapes();

  requestAnimationFrame(tick);
}

function rotateCamera(ev) {
  camera.panRight(ev.movementX*0.05);
  camera.panVertical(ev.movementY*0.05);
}


function keydown(ev) {
  if( ev.keyCode == 68) {
    camera.moveRight();
  }
  if(ev.keyCode == 65) {
    camera.moveLeft();
  }
  if(ev.keyCode == 87) {
    camera.moveForward();
  }
  if(ev.keyCode == 83) {
    camera.moveBackward();
  }
  if(ev.keyCode == 81) {
    camera.panLeft(5);
  }
  if(ev.keyCode == 69) {
    camera.panRight(5);
  }
  if(ev.keyCode == 32){
    camera.upward();   
  }
  if(ev.keyCode == 17){
    camera.downward();   
  }
  renderAllShapes();
}
  

  

function main() {

  setUpWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  document.onkeydown = keydown;

  renderAllShapes();
  requestAnimationFrame(tick);
}


function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; 
  var y = ev.clientY; 
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);

}

function renderAllShapes(){

  var startTime = performance.now();

  let projMat = camera.projectionMatrix;
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  
  let viewMat = camera.viewMatrix;
  viewMat.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);




var globalRotMat = new Matrix4();

gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
 

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



  var body = new Cube();
  var shell = new Cube();
  var shell_top = new Cube();
  var tail = new Pyramid();
  var head = new Cube();
  var tongue = new Cube();


  let legFL_1 = new Cube(); 
  let legFL_2 = new Cube();
  let legFL_3 = new Cube();

  let legFR_1 = new Cube(); 
  let legFR_2 = new Cube(); 
  let legFR_3 = new Cube();

  let legBL_1 = new Cube(); 
  let legBL_2 = new Cube(); 
  let legBL_3 = new Cube();

  let legBR_1 = new Cube(); 
  let legBR_2 = new Cube(); 
  let legBR_3 = new Cube();


  var l_flAngle = g_flAngle;
  var l_frAngle = g_frAngle;
  var l_flLowerAngle = g_flLowerAngle;
  var l_frLowerAngle = g_frLowerAngle;
  var l_blAngle = g_blAngle;
  var l_brAngle = g_brAngle;
  var l_blLowerAngle = g_blLowerAngle;
  var l_brLowerAngle = g_brLowerAngle;
  var l_head = g_headAngle;
  var l_tongue_extension = 0;

  var speedMult = 5;
  var distLegMultiplier = 15;
  var headMult = 5;

  if(g_animationPoke) {
    var distLegMultiplier = 15 + 10 * Math.cos(g_seconds*5 + 5);
    var headMult = 20;
    var speedMult = 10;
    l_tongue_extension = Math.cos(g_seconds*5)*0.3;
  }

  if(g_animationActive) {
    l_flAngle = g_flAngle*1 + 10 * Math.sin(g_seconds*speedMult);
    l_frAngle = g_frAngle*1 + 20 * Math.sin(g_seconds*speedMult);

    l_flLowerAngle = g_flLowerAngle * -10 + distLegMultiplier * Math.sin(g_seconds*speedMult + Math.PI);
    l_frLowerAngle = g_frLowerAngle * -10 + distLegMultiplier * Math.sin(g_seconds*speedMult + Math.PI);

    l_blAngle = g_blAngle*1 + 0.75*5 * Math.sin(g_seconds*speedMult + Math.PI);
    l_brAngle = g_brAngle*1 + 0.75*5 * Math.sin(g_seconds*speedMult);

    l_blLowerAngle = g_blLowerAngle * -10 + distLegMultiplier * Math.sin(g_seconds*speedMult + Math.PI);
    l_brLowerAngle = g_brLowerAngle * -10 + distLegMultiplier * Math.sin(g_seconds*speedMult);
    l_head = g_headAngle*1 + headMult* Math.sin(g_seconds*5);
  }




  // Body
  body.color = [0.5, 0.9, 0.2, 1.0];
  body.matrix.scale(0.5, 0.2, 0.75);
  body.matrix.translate(-0.5, -0.5, -0.5);
  var body_mat = new Matrix4(body.matrix);
  body.render();

  // Shell
  shell.color = [0.1, 0.6, 0.3, 1.0];
  shell.matrix.scale(0.55, 0.15, 0.8);
  shell.matrix.translate(-0.5, 0.5, -0.5);
  shell.render();

  shell_top.color = [0.1, 0.6, 0.3, 1.0];
  shell_top.matrix.scale(0.5, 0.15, 0.75);
  shell_top.matrix.translate(-0.5, 0.75, -0.5);
  shell_top.render();

  // Tail
  tail.color = [0.05, 0.5, 0.2, 1.0];
  tail.matrix.translate(-0.08 , 0.03, 0.37);
  tail.matrix.rotate(90, 1, 0, 0);
  tail.matrix.scale(0.15, 0.15, 0.1);
  tail.render();

  // Head
  head.color = [0.1, 0.6, 0.3, 1.0];
  head.matrix.translate(-0.1, -0.05, -0.65);
  //var head_mat = new Matrix4(head.matrix);
  head.matrix.rotate(-l_head, 1, 0, 0);
  head.matrix.scale(0.22, 0.22, 0.3);
  head.render();

  tongue.color = [8.0, 0.4, 0.9, 1.0];
  tongue.matrix = head.matrix;
  tongue.matrix.translate(0.38, 0.3, 0.2+l_tongue_extension);
  tongue.matrix.scale(0.2, 0.2, 0.5);
  tongue.render();



  //Front Left Leg

  legFL_1.color = [0.1, 0.6, 0.3, 1.0];
  legFL_1.matrix.setTranslate(0.15, 0.0, -0.3);
  legFL_1.matrix.rotate(l_flAngle, 1, 0, 0);
  var fl_matrix = new Matrix4(legFL_1.matrix);
  legFL_1.matrix.rotate(180, 1, 0, 0);
  legFL_1.matrix.scale(0.2, 0.15, -0.2);
  legFL_1.render();

  legFL_2.color = [0.1, 0.6, 0.3, 1.0];
  legFL_2.matrix = fl_matrix;
  legFL_2.matrix.translate(0.025, -0.1, 0);
  legFL_2.matrix.rotate(180, 1, 0, 0);
  legFL_2.matrix.rotate(l_flLowerAngle, 1, 0, 0);
  var fl2_matrix = new Matrix4(legFL_2.matrix);
  legFL_2.matrix.scale(0.15, 0.2, -0.15);
  legFL_2.render();

  legFL_3.color = [0.5, 0.9, 0.2, 1.0];
  legFL_3.matrix = fl2_matrix;
  legFL_3.matrix.translate(-0.01, 0.18, -0.14);
  legFL_3.matrix.scale(0.15, 0.09, 0.15);
  legFL_3.render();


  //Front Right Leg

  legFR_1.color = [0.1, 0.6, 0.3, 1.0];
  legFR_1.matrix.setTranslate(-0.35, 0.0, -0.3);
  legFR_1.matrix.rotate(l_frAngle, 1, 0, 0);
  var fl_matrix = new Matrix4(legFR_1.matrix);
  legFR_1.matrix.rotate(180, 1, 0, 0);
  legFR_1.matrix.scale(0.2, 0.15, -0.2);
  legFR_1.render();

  legFR_2.color = [0.1, 0.6, 0.3, 1.0];
  legFR_2.matrix = fl_matrix;
  legFR_2.matrix.translate(0.025, -0.1, 0);
  legFR_2.matrix.rotate(180, 1, 0, 0);
  legFR_2.matrix.rotate(l_frLowerAngle, 1, 0, 0);
  var fr2_matrix = new Matrix4(legFR_2.matrix);
  legFR_2.matrix.scale(0.15, 0.2, -0.15);
  legFR_2.render();

  legFR_3.color = [0.5, 0.9, 0.2, 1.0];
  legFR_3.matrix = fr2_matrix;
  legFR_3.matrix.translate(-0.01, 0.18, -0.14);
  legFR_3.matrix.scale(0.15, 0.09, 0.15);
  legFR_3.render();

  //Back Left

  legBL_1.color = [0.1, 0.6, 0.3, 1.0];
  legBL_1.matrix.setTranslate(0.15, 0.0, 0.15);
  legBL_1.matrix.rotate(l_blAngle, 1, 0, 0);
  var bl_matrix = new Matrix4(legBL_1.matrix);
  legBL_1.matrix.rotate(180, 1, 0, 0);
  legBL_1.matrix.scale(0.2, 0.15, -0.2);
  legBL_1.render();

  legBL_2.color = [0.1, 0.6, 0.3, 1.0];
  legBL_2.matrix = bl_matrix;
  legBL_2.matrix.translate(0.025, -0.1, 0);
  legBL_2.matrix.rotate(180, 1, 0, 0);
  legBL_2.matrix.rotate(l_blLowerAngle, 1, 0, 0);
  var bl2_matrix = new Matrix4(legBL_2.matrix);
  legBL_2.matrix.scale(0.15, 0.2, -0.15);
  legBL_2.render();

  legBL_3.color = [0.5, 0.9, 0.2, 1.0];
  legBL_3.matrix = bl2_matrix;
  legBL_3.matrix.translate(-0.01, 0.18, -0.14);
  legBL_3.matrix.scale(0.15, 0.09, 0.15);
  legBL_3.render();


  //Back Right Leg

  legBR_1.color = [0.1, 0.6, 0.3, 1.0];
  legBR_1.matrix.setTranslate(-0.35, 0.0, 0.15);
  legBR_1.matrix.rotate(l_brAngle, 1, 0, 0);
  var br_matrix = new Matrix4(legBR_1.matrix);
  legBR_1.matrix.rotate(180, 1, 0, 0);
  legBR_1.matrix.scale(0.2, 0.15, -0.2);
  legBR_1.render();

  legBR_2.color = [0.1, 0.6, 0.3, 1.0];
  legBR_2.matrix = br_matrix;
  legBR_2.matrix.translate(0.025, -0.1, 0);
  legBR_2.matrix.rotate(180, 1, 0, 0);
  legBR_2.matrix.rotate(l_brLowerAngle, 1, 0, 0);
  var br2_matrix = new Matrix4(legBR_2.matrix);
  legBR_2.matrix.scale(0.15, 0.2, -0.15);
  legBR_2.render();

  legBR_3.color = [0.5, 0.9, 0.2, 1.0];
  legBR_3.matrix = br2_matrix;
  legBR_3.matrix.translate(-0.01, 0.18, -0.14);
  legBR_3.matrix.scale(0.15, 0.09, 0.15);
  legBR_3.render();
  
  world.drawMap();
  world.drawSpace();
  var ocean = new Cube();
  ocean.color = [0, .25, .5, 1];
  ocean.matrix.translate(0, -0.75, 0);
  ocean.matrix.scale(40, .1, 40);
  ocean.matrix.translate(-.35, 0, -.35);
  ocean.render();

  var sky = new Cube();
  sky.color = [.1, .4, 1, .6];
  sky.matrix.translate(-1,0,-1);
  sky.matrix.scale(20,20,20);
  sky.matrix.translate(-.3,-.5,-.3);
  sky.render();

  

  var duration = performance.now() - startTime;

  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "fps");

}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");

  }

  htmlElm.innerHTML = text;
}






