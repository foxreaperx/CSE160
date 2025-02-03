// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_GlobalTranslateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_GlobalTranslateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_GlobalTranslateMatrix;

let g_cameraAngleX = 30.0;
let g_cameraAngleY = 60.0;
let g_cameraAngleZ = 0.0;

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

    u_GlobalTranslateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalTranslateMatrix');
    if(!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_GlobalTranslateMatrix');
      return;
    }

    let m = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, m.elements);

  }


  function addActionsForHtmlUI(){
    document.getElementById('animationOn').onclick = function() { g_animationActive = true;};
    document.getElementById('animationOff').onclick = function() { g_animationActive = false; g_animationPoke = false};
    document.getElementById('poke').onclick = function() { g_animationPoke= !g_animationPoke;};
    
    document.getElementById('camX').addEventListener('mousemove', function() {g_cameraAngleX = this.value; renderAllShapes();});
    document.getElementById('camY').addEventListener('mousemove', function() {g_cameraAngleY = this.value; renderAllShapes();});
    document.getElementById('camZ').addEventListener('mousemove', function() {g_cameraAngleZ = this.value; renderAllShapes();});

    document.getElementById('front-left-lower-slider').addEventListener('mousemove', function() {g_flLowerAngle = this.value; renderAllShapes();});

    document.getElementById('front-left-upper-slider').addEventListener('mousemove', function() {g_flAngle = this.value; renderAllShapes();});

    document.getElementById('front-right-lower-slider').addEventListener('mousemove', function() {g_frLowerAngle = this.value; renderAllShapes();});

    document.getElementById('front-right-upper-slider').addEventListener('mousemove', function() {g_frAngle = this.value; renderAllShapes();});

    document.getElementById('back-left-lower-slider').addEventListener('mousemove', function() {g_blLowerAngle= this.value; renderAllShapes();});

    document.getElementById('back-left-upper-slider').addEventListener('mousemove', function() {g_blAngle= this.value; renderAllShapes();});

    document.getElementById('back-right-lower-slider').addEventListener('mousemove', function() {g_brLowerAngle = this.value; renderAllShapes();});

    document.getElementById('back-right-upper-slider').addEventListener('mousemove', function() {g_brAngle = this.value; renderAllShapes();});
      
    document.getElementById('displayScreen').addEventListener('click', function(ev) {
      if(ev.shiftKey) {
        g_animationPoke = !g_animationPoke;
      }
    });

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
  }
  var g_startTime = performance.now()/1000.0;
  var g_seconds = performance.now()/1000.0 - g_startTime;
  
  function tick() {
    g_seconds = performance.now()/1000.0 - g_startTime;
    
  
    renderAllShapes();
  
    requestAnimationFrame(tick);
  }
  

  

function main() {

  setUpWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.5, 0.7, 1.0, 1.0);

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
  var globalRotMat = new Matrix4().rotate(-g_cameraAngleX*1, 1, 0, 0);
  globalRotMat.rotate(g_cameraAngleY*1, 0, 1, 0);
  globalRotMat.rotate(g_cameraAngleZ*1, 0, 0, 1);
  var globalTMat = new Matrix4().translate(0, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.uniformMatrix4fv(u_GlobalTranslateMatrix, false, globalTMat.elements);

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

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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






