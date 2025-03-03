class Sphere{
    // construct new Sphere object 
    constructor(){
        this.type           = 'sphere';
        this.color          = [1.0,1.0,1.0,1.0];
        this.matrix         = new Matrix4();
        this.normalMatrix   = new Matrix4();
        this.textureNum     = 0;
    }

    render(){
        let rgba = this.color;   
        
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        let d   = Math.PI/15;   
        let dd  = Math.PI/15;  

        for(let t=0; t<Math.PI; t += d){
            for(let r=0; r<(2*Math.PI); r += d){


                let p1  = [Math.sin(t)*Math.cos(r),       Math.sin(t)*Math.sin(r),       Math.cos(t)];
                let p2  = [Math.sin(t+dd)*Math.cos(r),    Math.sin(t+dd)*Math.sin(r),    Math.cos(t+dd)];
                let p3  = [Math.sin(t)*Math.cos(r+dd),    Math.sin(t)*Math.sin(r+dd),    Math.cos(t)];
                let p4  = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

                let uv1 = [t/Math.PI,       r/(2*Math.PI)];
                let uv2 = [(t+dd)/Math.PI,  r/(2*Math.PI)];
                let uv3 = [(t)/Math.PI,     (r+dd)/(2*Math.PI)];
                let uv4 = [(t+dd)/Math.PI,  (r+dd)/(2*Math.PI)];

                let n1 = [-Math.sin(t) * Math.cos(r), -Math.sin(t) * Math.sin(r), -Math.cos(t)];
                let n2 = [-Math.sin(t + dd) * Math.cos(r), -Math.sin(t + dd) * Math.sin(r), -Math.cos(t + dd)];
                let n3 = [-Math.sin(t) * Math.cos(r + dd), -Math.sin(t) * Math.sin(r + dd), -Math.cos(t)];
                let n4 = [-Math.sin(t + dd) * Math.cos(r + dd), -Math.sin(t + dd) * Math.sin(r + dd), -Math.cos(t + dd)];

                let v = [];
                v = v.concat(p1); 
                v = v.concat(p2);  
                v = v.concat(p4); 
                
                let uv = [];
                uv = uv.concat(uv1); 
                uv = uv.concat(uv2); 
                uv = uv.concat(uv4);

                let n = [];
                n = n.concat(n1); 
                n = n.concat(n2); 
                n = n.concat(n4);
                drawTriangle3DUVNormal(v,uv,n);

                v = [];
                v = v.concat(p1); 
                v = v.concat(p4);  
                v = v.concat(p3); 

                uv = [];
                uv = uv.concat(uv1); 
                uv = uv.concat(uv4); 
                uv = uv.concat(uv3);

                n = [];
                n = n.concat(n1); 
                n = n.concat(n4); 
                n = n.concat(n3);

                drawTriangle3DUVNormal(v,uv,n);
            }
        }

    }
}