const THREE = require('three/build/three.js');
const OBJLoader = require('./OBJLoader');
const glslify = require('glslify');

export default class Head {
  constructor() {
    this.cubeCamera = new THREE.CubeCamera(1, 15000, 1024);
    this.instances = 6;
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    }
  }

  init() {
    return new Promise((resolve, reject) => {
      var p_geom = new THREE.Geometry()
      this.manager = new THREE.LoadingManager()
      this.loadObject().then((object) => {
        this.obj = object
        this.obj.traverse( (child) => {
          if (child instanceof THREE.Mesh) {
            var scale = 15
            child.geometry.vertices.forEach(position => {
              p_geom.vertices.push(new THREE.Vector3(position.x * scale, position.y * scale, position.z * scale))
            })
          }
          this.p = new THREE.Points(
            p_geom,
            new THREE.ShaderMaterial( {
              uniforms: this.uniforms, 
              vertexShader: glslify('../../../../glsl/sketch/reel/particles.vs'),
              fragmentShader: glslify('../../../../glsl/sketch/reel/particles.fs')
            })
          )
          this.p.position.set(0, 300, 0);
        })
        resolve()
      })
    })
  }

  loadObject() {
    return new Promise ((resolve, reject) => {
      var loader = new THREE.OBJLoader(this.manager)
      loader.load( '/sketch-threejs/img/sketch/reel/test3.obj', ( object ) => {
        resolve(object)
      })
    })
  }
  
  render(renderer, scene, time) {
    if (!this.obj) {
      return
    }
    this.uniforms.time.value += time;
    this.obj.visible = false;
    this.cubeCamera.update(renderer, scene);
    this.obj.visible = true;
    this.p.rotateY(0.008)
  }
}
