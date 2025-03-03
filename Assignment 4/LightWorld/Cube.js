class Cube {
  constructor() {
      this.type = 'cube';
      this.color = [0.5, 0.5, 0.5, 0.5];
      this.matrix = new Matrix4();

  
    this.vertices = [
      // Front of cube
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
  
      // Top of cube (y = 1)
      0,1,0, 1,1,1, 0,1,1, 
      0,1,0, 1,1,0, 1,1,1, 
  
      // Bottom of cube (y = 0)
      0,0,0, 0,0,1, 1,0,1,
      0,0,0, 1,0,1, 1,0,0,
  
      // Left side of cube (x = 1)
      1,0,0, 1,1,1, 1,1,0,
      1,0,0, 1,0,1, 1,1,1,
  
      // Right side of cube (x = 0)
      0,0,0, 0,1,1, 0,1,0,
      0,0,0, 0,0,1, 0,1,1,
  
      // Back of cube (z = 1)
      0,0,1, 1,1,1, 0,1,1,
      0,0,1, 1,0,1, 1,1,1
  ];
    

    this.uvVertices  = ( [
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1
  ]);

  this.normVertices  = ( [
    0,0,-1, 0,0,-1, 0,0,-1,
    0,0,-1, 0,0,-1, 0,0,-1,
    0,1,0, 0,1,0, 0,1,0,
    0,1,0, 0,1,0, 0,1,0,
    0,-1,0, 0,-1,0, 0,-1,0,
    0,-1,0, 0,-1,0, 0,-1,0,
    1,0,0, 1,0,0, 1,0,0,
    1,0,0, 1,0,0, 1,0,0,
    -1,0,0, -1,0,0, -1,0,0,
    -1,0,0, -1,0,0, -1,0,0,
    0,0,1, 0,0,1, 0,0,1,
    0,0,1, 0,0,1, 0,0,1
]);

      this.textureNum = [0,0,0,0,0,0];
      this.textureNumberPlain = 0;
  }

  render() {
      if(this.buffer === null) {
          this.buffer = gl.createBuffer();
          if (!this.buffer) {
            console.log("Failed to create the buffer object");
            return -1;
          }
      }

      var rgba = this.color;
      //console.log(this.textureNum," Here");
  

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // front
      gl.uniform1i(u_whichTexture, this.textureNum[0]);
      gl.uniform4f(u_FragColor, 0.9*rgba[0], 0.9*rgba[1], 0.9*rgba[2], rgba[3]);
      drawTriangle3DUVNormal([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0],[0,0, 1,1, 1,0],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]);
      drawTriangle3DUVNormal([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0],[0,0, 0,1, 1,1],[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]);

      // right
      gl.uniform1i(u_whichTexture, this.textureNum[1]);
      gl.uniform4f(u_FragColor, 0.75*rgba[0], 0.75*rgba[1], 0.75*rgba[2], rgba[3]);
      drawTriangle3DUVNormal([1.0, 0.0, 0.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0],[0,0,1,1,1,0],[-1, 0, 0, -1, 0, 0, -1, 0, 0]);
      drawTriangle3DUVNormal([1.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 1.0],[0,0,0,1,1,1],[-1, 0, 0, -1, 0, 0, -1, 0, 0]);

      // left
      gl.uniform1i(u_whichTexture, this.textureNum[2]);
      drawTriangle3DUVNormal([0.0, 0.0, 0.0,  0.0, 1.0, 1.0,  0.0, 0.0, 1.0],[0,0,1,1,1,0],[1, 0, 0, 1, 0, 0, 1, 0, 0]);
      drawTriangle3DUVNormal([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 1.0],[0,0,0,1,1,1],[1, 0, 0, 1, 0, 0, 1, 0, 0]);

      // top
      gl.uniform1i(u_whichTexture, this.textureNum[3]);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle3DUVNormal([0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0],[0,0,1,1,1,0],[0, -1, 0, 0, -1, 0, 0, -1, 0]);
      drawTriangle3DUVNormal([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0],[0,0,0,1,1,1],[0, -1, 0, 0, -1, 0, 0, -1, 0]);

      // bottom
      gl.uniform1i(u_whichTexture, this.textureNum[4]);
      gl.uniform4f(u_FragColor, 0.5*rgba[0], 0.5*rgba[1], 0.5*rgba[2], rgba[3]);
      drawTriangle3DUVNormal([0.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 0.0, 0.0],[0,0,1,1,1,0],[0, 1, 0, 0, 1, 0, 0, 1, 0]);
      drawTriangle3DUVNormal([0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0], [0,0,0,1,1,1],[0, 1, 0, 0, 1, 0, 0, 1, 0]);
      gl.uniform4f(u_FragColor, 0.75*rgba[0], 0.75*rgba[1], 0.75*rgba[2], rgba[3]);
      
      // back
      gl.uniform1i(u_whichTexture, this.textureNum[5]);
      drawTriangle3DUVNormal([0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0],[0,0, 1,1, 1,0],[0,0,-1,0,0,-1,0,0,-1]);
      drawTriangle3DUVNormal([0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0],[0,0, 0,1, 1,1],[0,0,-1,0,0,-1,0,0,-1]);


  }


  renderfaster(){
    var rgba = this.color;
    
    gl.uniform1i(u_whichTexture, this.textureNumberPlain);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    drawTriangle3DUVNormal(this.vertices, this.uvVertices,this.normVertices);
}

  
}
