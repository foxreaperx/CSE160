// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 20.0;
    gl_PointSize = u_Size;
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

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }


  }

  const POINT = 0;
  const TRIANGLE = 1;
  const CIRCLE = 2;

  let g_selectedColor = [1.0,1.0,1.0,1.0];
  let g_selectedSize = 5;
  let g_selectedType = POINT;
  let g_selectedSegments = 5;

  function addActionsForHtmlUI(){
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0];};
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0];};
    document.getElementById('blue').onclick = function() { g_selectedColor = [0.0,0.0,1.0,1.0];};
    document.getElementById('eraser').onclick = function() { g_selectedColor = [0.0,0.0,0.0,1.0];};
    
    document.getElementById('undoButton').onclick = function() { g_shapesList.pop(); renderAllShapes()};
    document.getElementById('clearButton').onclick = function() { g_shapesList=[]; renderAllShapes()};
    document.getElementById('saveButton').addEventListener('click', function() {savePicture()});

    document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
    document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
    document.getElementById('foxButton').onclick = function () {drawFoxFace();};

    document.getElementById('segmentslide').addEventListener('mouseup', function() { g_selectedSegments = this.value; });
    document.getElementById('redslide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenslide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueslide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    document.getElementById('sizeslide').addEventListener('mouseup', function() { g_selectedSize = this.value;});

  }

  function drawFoxFace() {
    const foxTriangles = [
      // Main Face (Base - Orange)
      { vertices: [-0.5, 0.5, 0.5, 0.5, 0.0, -0.4], color: [1.0, 0.5, 0.0, 1.0] },

      // Main Ears (Base - Orange)
      { vertices: [-0.2, 0.4, -0.6, 0.4, -0.6, 0.9], color: [1.0, 0.5, 0.0, 1.0] },
      { vertices: [0.2, 0.4, 0.6, 0.4, 0.6, 0.9], color: [1.0, 0.5, 0.0, 1.0] },

      // Inside Ears (Base - White)
      { vertices: [-0.4, 0.5, -0.5, 0.5, -0.5, 0.7], color: [1.0, 1.0, 1.0, 1.0] },
      { vertices: [0.4, 0.5, 0.5, 0.5, 0.5, 0.7], color: [1.0, 1.0, 1.0, 1.0] },

      // Nose (Base - Black)
      { vertices: [0.1, -0.2, 0.0, -0.1, -0.1, -0.2], color: [0.2, 0.2, 0.2, 1.0] },
      { vertices: [0.1, -0.2, 0.0, -0.3, -0.1, -0.2], color: [0.7, 0.7, 0.7, 1.0] },

      // Face Accent
      { vertices: [0.0, 0.4, -0.2, 0.2, 0.0, 0.1], color: [0.9, 0.9, 0.9, 1.0] },
      { vertices: [0.0, 0.4, 0.2, 0.2, 0.0, 0.1], color: [0.7, 0.7, 0.7, 1.0] },

      // Eyes
      { vertices: [-0.25, 0.25, -0.3, 0.3, -0.2, 0.3], color: [0.0, 0.0, 0.0, 1.0] },
      { vertices: [-0.25, 0.35, -0.3, 0.3, -0.2, 0.3], color: [0.1, 0.1, 0.1, 1.0] },
      { vertices: [0.25, 0.25, 0.3, 0.3, 0.2, 0.3], color: [0.0, 0.0, 0.0, 1.0] },
      { vertices: [0.25, 0.35, 0.3, 0.3, 0.2, 0.3], color: [0.1, 0.1, 0.1, 1.0] },

      // Face
      { vertices: [-0.2, 0.1, 0.0, -0.1, 0.2, 0.1], color: [1.0, 0.6, 0.0, 1.0] },

      // Face Fur
      { vertices: [-0.3, 0.2, -0.6, 0.2, -0.1, -0.2], color: [1.0, 0.6, 0.0, 1.0] },
      { vertices: [0.3, 0.2, 0.6, 0.2, 0.1, -0.2], color: [1.0, 0.6, 0.0, 1.0] },

      { vertices: [-0.45, 0.45, -0.6, 0.2, -0.3, 0.2], color: [1.0, 1.0, 1.0, 1.0] },
      { vertices: [0.45, 0.45, 0.6, 0.2, 0.3, 0.2], color: [1.0, 1.0, 1.0, 1.0] },
      
      { vertices: [-0.3, 0.5, 0.0, 0.6, 0.3, 0.5], color: [1.0, 0.4, 0.0, 1.0] },


    ];
  
    // Render each triangle
    foxTriangles.forEach(({ vertices, color }) => {
      const triangle = new Triangle();
      triangle.color = color;
      triangle.render = function () {
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        drawTriangle(vertices);
      };
      triangle.render();
      g_shapesList.push(triangle);
    });
  }

function main() {

  setUpWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  updateColorDisplay();


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;

  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];
function click(ev) {
  
  let [x,y] = convertCoordinatesEventToGL(ev);

  let point;
  
  if (g_selectedType==POINT){
    point = new Point();
  } else if( g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }

  point.position=[x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  point.segments = g_selectedSegments;
  g_shapesList.push(point);
  // // Store the coordinates to g_points array
  // g_points.push([x, y]);
  // // Store the coordinates to g_points array
  // g_colors.push(g_selectedColor.slice());

  // g_sizes.push(g_selectedSize);
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  renderAllShapes();
  
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);

}

function renderAllShapes(){

  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;

  sendTextToHTML("numdot: " + len + "ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");

}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");

  }

  htmlElm.innerHTML = text;
}





// Get references to the sliders and the color display div
const redSlider = document.getElementById("redslide");
const greenSlider = document.getElementById("greenslide");
const blueSlider = document.getElementById("blueslide");
const colorDisplay = document.getElementById("colorDisplay");

// Function to update the color display
function updateColorDisplay() {
  const red = redSlider.value;
  const green = greenSlider.value;
  const blue = blueSlider.value;

  const red255 = Math.round((red / 100) * 255);
  const green255 = Math.round((green / 100) * 255);
  const blue255 = Math.round((blue / 100) * 255);

  // Update the background color of the colorDisplay div
  colorDisplay.style.backgroundColor = `rgb(${red255}, ${green255}, ${blue255})`;
  colorDisplay.innerText = `Color`;
}

// Add event listeners to each slider to update the color display when the value changes
redSlider.addEventListener("input", updateColorDisplay);
greenSlider.addEventListener("input", updateColorDisplay);
blueSlider.addEventListener("input", updateColorDisplay);

function savePicture(){
    // Get the canvas element
    const canvas = document.getElementById('webgl');
  
    // Convert the canvas to a data URL (in PNG format)
    const dataURL = canvas.toDataURL('image/png');
    
    // Create a temporary <a> element for downloading the image
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'my_drawing.png'; // Name of the file to download
    
    // Programmatically click the link to trigger the download
    link.click();
}
