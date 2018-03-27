const THREE = require('three/build/three.js');
const OBJLoader = require('./OBJLoader');
const glslify = require('glslify');

export default class Head {
  constructor() {
    this.manager = new THREE.LoadingManager()
    this.cubeCamera = new THREE.CubeCamera(1, 15000, 1024);
    this.instances = 6;
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.obj = this.createObj();
    console.log(this.obj)
    this.obj.rotation.set(0, 0.3 * Math.PI, 0);
  }
  
  createObj() {
    var p_geom = new THREE.Geometry()
    var p_material = new THREE.ParticleBasicMaterial({
      color: 0x00ffff,
      size: 10
    })

    // model
    var loader = new THREE.OBJLoader(this.manager)
    loader.load( '/sketch-threejs/img/sketch/reel/test.obj', (object) => {
      object.traverse( (child) => {

          if (child instanceof THREE.Mesh) {
            var scale = 10
            child.geometry.vertices.forEach(position => {
              p_geom.vertices.push(new THREE.Vector3(position.x * scale, position.y * scale, position.z * scale))
            })
          }
      })

    })

    var p = new THREE.ParticleSystem(
      p_geom,
      p_material
    )
    
    return p

    // var geometry = new THREE.BoxGeometry( 500, 500, 500 );
    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // var cube = new THREE.Mesh( geometry, material );
    // return cube

  }
  render(renderer, scene, time) {
    this.uniforms.time.value += time;
    this.obj.visible = false;
    this.cubeCamera.update(renderer, scene);
    this.obj.visible = true;
  }
}
