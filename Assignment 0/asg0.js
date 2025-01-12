
// Retrieve <canvas> element
let canvas = document.getElementById('asg0');  


// Get the rendering context for 2DCG
let ctx = canvas.getContext('2d');


function main() {  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 
  // Draw a black rectangle
  ctx.fillStyle = 'black'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);     // Fill a rectangle with the color

}
function handleDrawEvent(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const v1x = document.getElementById("v1-x").value;
  const v1y = document.getElementById("v1-y").value;
  const v2x = document.getElementById("v2-x").value;
  const v2y = document.getElementById("v2-y").value;
  const v1 = new Vector3([v1x, v1y, 0]);
  const v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v1, 'red');
  drawVector(v2, 'blue');

}

function drawVector(v,color){
  const scale = 20;
  const centerX = canvas.width/2;
  const centerY = canvas.height/2;
  //console.log(v);

  let x = v.elements[0] * scale;
  let y = v.elements[1] * scale;

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY - y);
  ctx.stroke();
}

function handleDrawOperationEvent(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const v1x = document.getElementById("v1-x").value;
  const v1y = document.getElementById("v1-y").value;
  const v2x = document.getElementById("v2-x").value;
  const v2y = document.getElementById("v2-y").value;
  const v1 = new Vector3([v1x, v1y, 0]);
  const v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v1, 'red');
  drawVector(v2, 'blue');

  const operation = document.getElementById('operation').value;
  const scalar = document.getElementById('scalar').value;

  let v3, v4;
  switch (operation) {
    case 'add':
        v3 = v1.add(v2);
        drawVector(v3, 'green');
        break;
    case 'sub':
        v3 = v1.sub(v2);
        drawVector(v3, 'green');
        break;
    case 'div':
      v3 = v1.div(scalar);
      v4 = v2.div(scalar);
      drawVector(v3, 'green');
      drawVector(v4, 'green');
      break;
    case 'mul':
        v3 = v1.mul(scalar);
        v4 = v2.mul(scalar);
        drawVector(v3, 'green');
        drawVector(v4, 'green');
        break;
    case 'ang':
      console.log("Angle: ",Math.acos(Vector3.dot(v1,v2)/(v1.magnitude() * v2.magnitude())) * (180 / Math.PI));
      break;
    case 'are':
      console.log("Area of the triangle: ",Vector3.cross(v1,v2).magnitude()/2);
      break;
    case 'mag':
      console.log("Magnitude v1: ",v1.magnitude());
      console.log("Magnitude v2: ",v2.magnitude());
      break;
    case 'nom':
      v3 = v1.normalize();
      v4 = v2.normalize();
      drawVector(v3, 'green');
      drawVector(v4, 'green');
      break;
  }
}


