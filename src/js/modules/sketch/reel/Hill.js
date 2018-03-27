const THREE = require('three/build/three.js');
const OBJLoader = require('./OBJLoader');
const glslify = require('glslify');

export default class Hill {
  constructor() {
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
    // this.obj.rotation.set(0, 0.3 * Math.PI, 0);

    this.manager = new THREE.LoadingManager()
  }
  
  createObj() {
    var p_geom = new THREE.Geometry()
    var p_material = new THREE.ParticleBasicMaterial({
      color: 0x00ffff,
      size: 1
    })

    console.log('p_geom', p_geom)
    // model
    var loader = new THREE.OBJLoader(this.manager)
    loader.load( '/sketch-threejs/img/sketch/reel/test.obj', (object) => {
      // console.log('object:', object)
      object.traverse( (child) => {

          if (child instanceof THREE.Mesh) {
            var scale = 10
            // console.log('child is :', child)
            // console.log(child.geometry.vertices)
            child.geometry.vertices.forEach(position => {
              // console.log(position)
              // break;
              p_geom.vertices.push(new THREE.Vector3(position.x * scale, position.y * scale, position.z * scale))
            });
            // for (var i = 0; i < 1000; i++) {
            //   p_geom.vertices.push(new THREE.Vector3(this.x * scale, this.y * scale, this.z * scale))
            // }
          }
      })

    })

    var p = new THREE.ParticleSystem(
      p_geom,
      p_material
    )

    console.log(p)
    return p
    // $('.particlehead').append(Scene.renderer.domElement)
  }
  render(renderer, scene, time) {
    this.uniforms.time.value += time;
    this.obj.visible = false;
    this.cubeCamera.update(renderer, scene);
    this.obj.visible = true;
  }
}
