class Circle{
    constructor(){
      this.type='circle';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 5.0;
      this.segments = 5;
    }
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      var d = this.size/200.0;
      let angleStep = 360/this.segments;
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      for( var angle = 0;angle<360;angle = angle + angleStep){
        let centerPt = [xy[0],xy[1]];
        let angle1 = angle;
        let angle2 = angle + angleStep;
        let vect1 = [Math.cos(angle1*Math.PI/180)*d,Math.sin(angle1*Math.PI/180)*d];
        let vect2 = [Math.cos(angle2*Math.PI/180)*d,Math.sin(angle2*Math.PI/180)*d];
        let pt1 = [centerPt[0]+vect1[0], centerPt[1]+vect1[1]];
        let pt2 = [centerPt[0]+vect2[0], centerPt[1]+vect2[1]];

        drawTriangle([xy[0],xy[1],pt1[0],pt1[1],pt2[0],pt2[1]]);
      }
      
    }
  }