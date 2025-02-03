class Cube {
  constructor() {
      this.type = 'cube';
      this.color = [0.5, 0.5, 0.5, 0.5];
      this.matrix = new Matrix4();

      this.buffer = null;
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

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // front
      gl.uniform4f(u_FragColor, 0.9*rgba[0], 0.9*rgba[1], 0.9*rgba[2], rgba[3]);
      drawTriangle3D([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0], this.buffer);
      drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0], this.buffer);

      // right
      gl.uniform4f(u_FragColor, 0.75*rgba[0], 0.75*rgba[1], 0.75*rgba[2], rgba[3]);
      drawTriangle3D([1.0, 0.0, 0.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0], this.buffer);
      drawTriangle3D([1.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 1.0], this.buffer);

      // left
      drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 1.0,  0.0, 0.0, 1.0], this.buffer);
      drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 1.0], this.buffer);

      // top
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle3D([0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0], this.buffer);
      drawTriangle3D([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0], this.buffer);

      // bottom
      gl.uniform4f(u_FragColor, 0.5*rgba[0], 0.5*rgba[1], 0.5*rgba[2], rgba[3]);
      drawTriangle3D([0.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 0.0, 0.0], this.buffer);
      drawTriangle3D([0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0], this.buffer);
      gl.uniform4f(u_FragColor, 0.75*rgba[0], 0.75*rgba[1], 0.75*rgba[2], rgba[3]);
      
      // back
      drawTriangle3D([0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0], this.buffer);
      drawTriangle3D([0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0], this.buffer);


  }
}