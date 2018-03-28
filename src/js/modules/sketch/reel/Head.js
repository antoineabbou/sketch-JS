const THREE = require('three/build/three.js');
const OBJLoader = require('./OBJLoader');
const glslify = require('glslify');
const particleVert = require('../../../../glsl/sketch/reel/particles.vs')
const particleFrag = require('../../../../glsl/sketch/reel/particles.fs')

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
    
    // this.obj = this.createObj();
    
    // this.obj.rotation.set(0, 0.3 * Math.PI, 0);
  }

  init() {
    return new Promise((resolve, reject) => {
      var p_geom = new THREE.Geometry()
      var p_material = new THREE.PointsMaterial({
        color: 0x2a2a2a,
        size: 0.0002
      })
      this.manager = new THREE.LoadingManager()
      this.loadObject().then((object) => {
        this.obj = object
        this.obj.traverse( (child) => {
          if (child instanceof THREE.Mesh) {
            var scale = 400
            child.geometry.vertices.forEach(position => {
              p_geom.vertices.push(new THREE.Vector3(position.x * scale, position.y * scale, position.z * scale))
            })
          }
          this.p = new THREE.Points(
            p_geom,
            p_material
          )
          // this.p.scale.set(300, 300 , 300)
          this.p.position.set(0, 300, 0);
        })
        console.log(this.p)
        resolve()
      })
    })
  }
  
  createObj() {
    // var p_geom = new THREE.Geometry()
    // var p_material = new THREE.PointsMaterial({
    //   color: 0x00ffff,
    //   size: 10
    // })

    // model
    // var loader = new THREE.OBJLoader(this.manager)
    // loader.load( '/sketch-threejs/img/sketch/reel/test.obj', (object) => {
    //   object.traverse( (child) => {
    //     if (child instanceof THREE.Mesh) {
    //       var scale = 1000
    //       child.geometry.vertices.forEach(position => {
    //         p_geom.vertices.push(new THREE.Vector3(position.x * scale, position.y * scale, position.z * scale))
    //       })
    //     }
    //   })

    // })
  
    // var p = new THREE.Points(
    //   p_geom,
    //   p_material
    // )
    
    // return p
    
    // var geometry = new THREE.BoxGeometry( 500, 500, 500 );
    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // var cube = new THREE.Mesh( geometry, material );
    // return cube  
  }

  loadObject() {
    return new Promise ((resolve, reject) => {
      var loader = new THREE.OBJLoader(this.manager)
      loader.load( '/sketch-threejs/img/sketch/reel/test.obj', ( object ) => {
        // object.scale.set(100, 100 , 100)
        resolve(object)
        // return object
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
    this.p.rotateY(0.01)
  }
}
