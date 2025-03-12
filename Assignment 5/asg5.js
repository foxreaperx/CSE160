import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
  renderer.setClearColor( 0xAAAAAA );
	renderer.shadowMap.enabled = true;

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 20;
  camera.position.y = 20;

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );
    light.castShadow = true;
		light.shadow.mapSize.width = 4048;
		light.shadow.mapSize.height = 4048;


    const d = 20;
		light.shadow.camera.left = - d;
		light.shadow.camera.right = d;
		light.shadow.camera.top = d;
		light.shadow.camera.bottom = - d;
		light.shadow.camera.near = 1;
		light.shadow.camera.far = 20;
		light.shadow.bias = 0.001;

	}

  const groundGeometry = new THREE.PlaneGeometry( 20, 20 );
	const groundMaterial = new THREE.MeshPhongMaterial( { color: 0xAFEEEE,side: THREE.DoubleSide } );
	const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
	groundMesh.rotation.x = Math.PI * - .5;
  groundMesh.position.y += -2;
	groundMesh.receiveShadow = true;
	scene.add( groundMesh );



  const asteroids = [];
  const numAsteroids = 150; // Number of dodecahedrons

  for (let i = 0; i < numAsteroids; i++) {
    // Create geometry
    const geometry = new THREE.DodecahedronGeometry(1.5);

    // Rough dark gray material to look like asteroids
    const material = new THREE.MeshStandardMaterial({
        color: 0x555555, // Dark gray
        roughness: 1,    // Make it non-reflective
        metalness: 0.4   // Slight metallic effect for realism
    });

    // Create asteroid mesh
    const asteroid = new THREE.Mesh(geometry, material);

    // Random position in the range of -20 to 20
    asteroid.position.set(
        Math.random() * 100 - 50, // X-axis
        Math.random() * 100 - 50, // Y-axis
        Math.random() * 100 - 50  // Z-axis
    );

    // Slightly scale each asteroid randomly to vary sizes
    const scale = Math.random() * 1.5 + 0.5;
    asteroid.scale.set(scale, scale, scale);

    // Add to scene and array
    scene.add(asteroid);
    asteroids.push(asteroid);
}

{

  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    'ursa.jpg',
    () => {

      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;

    } );

}

	
  
  
  const boxWidth = 2;
	const boxHeight = 2;
	const boxDepth = 2;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
  

	function makeInstance( geometry, color, x ) {

		//const material = new THREE.MeshPhongMaterial( { color } );

    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'cheese.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const material1 = new THREE.MeshBasicMaterial({
      map: texture,
    });


		const cube = new THREE.Mesh( geometry, material1 );
    cube.castShadow = true;
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}

	const cubes = [
		makeInstance( geometry, 0x44aa88, 0 ),
	];



  {
    const columnGeometry = new THREE.CylinderGeometry(1, 1, 10, 32); // (topRadius, bottomRadius, height, segments)
    const columnMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.8 });
    const column = new THREE.Mesh(columnGeometry, columnMaterial);
    column.position.set( 5, 3, 8 );
    column.castShadow = true;
    scene.add(column);


  }
  {
    const color = 0xFFFFFF;
    const skyColor = 0x90EE90;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1.5;
    //const light = new THREE.AmbientLight(color, intensity);
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    light.position.y += 10;
    scene.add(light)
  }


  {
    const color = 0xFFFFFF;
		const intensity = 150;
		const light = new THREE.PointLight( color, intensity );
		light.position.set( 10, 5, 10 );
		scene.add( light );
    light.castShadow = true;
    const helper = new THREE.PointLightHelper( light );
		scene.add( helper );
  }



  //T-65 X-Wing Starfighter by Ti Kawamoto [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/100p3RNw-5Q)

  {
    const mtlLoader = new MTLLoader();
		mtlLoader.load( 'materials.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
			objLoader.setMaterials( mtl );
			objLoader.load( 'model.obj', ( root ) => {

        root.scale.set(5, 5, 5); // Scale up by 2x in all directions

        // Move the model forward
        root.position.z += 8;
        root.castShadow = true;

				scene.add( root );

			} );

		} );

  }

  const bodyRadiusTop = .4;
	const bodyRadiusBottom = .2;
	const bodyHeight = 2;
	const bodyRadialSegments = 6;
	const bodyGeometry = new THREE.CylinderGeometry(
		bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments );

	const headRadius = bodyRadiusTop * 0.8;
	const headLonSegments = 12;
	const headLatSegments = 5;
	const headGeometry = new THREE.SphereGeometry(
		headRadius, headLonSegments, headLatSegments );

	function makeLabelCanvas( baseWidth, size, name ) {

		const borderSize = 2;
		const ctx = document.createElement( 'canvas' ).getContext( '2d' );
		const font = `${size}px bold sans-serif`;
		ctx.font = font;
		// measure how long the name will be
		const textWidth = ctx.measureText( name ).width;

		const doubleBorderSize = borderSize * 2;
		const width = baseWidth + doubleBorderSize;
		const height = size + doubleBorderSize;
		ctx.canvas.width = width;
		ctx.canvas.height = height;

		// need to set font again after resizing canvas
		ctx.font = font;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';

		ctx.fillStyle = 'blue';
		ctx.fillRect( 0, 0, width, height );

		// scale to fit but don't stretch
		const scaleFactor = Math.min( 1, baseWidth / textWidth );
		ctx.translate( width / 2, height / 2 );
		ctx.scale( scaleFactor, 1 );
		ctx.fillStyle = 'white';
		ctx.fillText( name, 0, 0 );

		return ctx.canvas;

	}

	function makePerson( x, labelWidth, size, name, color ) {

		const canvas = makeLabelCanvas( labelWidth, size, name );
		const texture = new THREE.CanvasTexture( canvas );
		// because our canvas is likely not a power of 2
		// in both dimensions set the filtering appropriately.
		texture.minFilter = THREE.LinearFilter;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;

		const labelMaterial = new THREE.SpriteMaterial( {
			map: texture,
			transparent: true,
		} );
		const bodyMaterial = new THREE.MeshPhongMaterial( {
			color,
			flatShading: true,
		} );

		const root = new THREE.Object3D();
		root.position.x = x;
    root.position.z = x;
    root.position.y += -2;
    root.castShadow = true;

		const body = new THREE.Mesh( bodyGeometry, bodyMaterial );
		root.add( body );
		body.position.y = bodyHeight / 2;

		const head = new THREE.Mesh( headGeometry, bodyMaterial );
		root.add( head );
		head.position.y = bodyHeight + headRadius * 1.1;

		const labelBaseScale = 0.01;
		const label = new THREE.Sprite( labelMaterial );
		root.add( label );
		label.position.y = head.position.y + headRadius + size * labelBaseScale;

		label.scale.x = canvas.width * labelBaseScale;
		label.scale.y = canvas.height * labelBaseScale;

		scene.add( root );
		return root;

	}

	makePerson( + 5, 150, 32, 'Annabel', 'yellow' );


  {
    const near = 20;
    const far = 40;
    const color = 0xCBC3E3;
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
  }



	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );
      renderer.setSize( window.innerWidth*0.8, window.innerHeight*0.8 );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

    asteroids.forEach(d => {
      d.rotation.x += 0.01;
      d.rotation.y += 0.01;
    });

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();