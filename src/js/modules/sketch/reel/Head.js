import { Geometry } from 'three';

import ObjectManager from './objectManager'
import particleSystem from './particleSystem'
const THREE = require('three/build/three.js');
const OBJLoader = require('./OBJLoader');
const glslify = require('glslify');
const GeometryUtils = require('./GeometryUtils')

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
    this.animTime = 0
  }

  initParticleSystem(objBuffers) {
    this.ParticleSystem = new particleSystem({count: 10000, objBuffers: objBuffers})
    console.log('ok')
    return this.ParticleSystem.mesh 
  }

  init() {
    return new Promise(resolve => {
      this.transform().then(objBuffers => {
        this.ParticleSystem = new particleSystem({count: 10000, objBuffers: objBuffers})
        this.render()
        resolve(this.ParticleSystem.mesh)
      })
    })
   
  }

  transform() {
    return new Promise(resolve => {
      this.load().then(objVects => {
          let count = 0
          let objBuffers = []
          for (let i = 0; i < objVects.length; i++) {
              let objBuffer = this.transformVectorToBuffer(objVects[i])
             
              objBuffers.push(objBuffer)
              console.log('ayo')
              count ++
              if(count == objVects.length) resolve(objBuffers)           
          }     
      })
  })        
  }

  transformVectorToBuffer(positions) {
    let objBuffer = new Float32Array(positions.length*3)

    let objBufferIterator = 0
    for (let i = 0; i < objBuffer.length; i++) {
       
        objBuffer[objBufferIterator++] = positions[Math.floor((i)/3)].x        
       
        objBuffer[objBufferIterator++] = positions[Math.floor((i)/3)].y  
       
        objBuffer[objBufferIterator++] = positions[Math.floor((i)/3)].z  
    }

    return objBuffer
}

  load() {
    this.ObjectManager = new ObjectManager()
    
    return new Promise((resolve, reject) => {
     
      this.ObjectManager.loadObject(['/sketch-threejs/img/sketch/reel/mask.obj','/sketch-threejs/img/sketch/reel/mask.obj']).then(objects => {
        let count = 0
        let objVects = []
        for (let i = 0; i < objects.length; i++) {
            this.objects = objects
            let objVect = GeometryUtils.default.randomPointsInGeometry( objects[i].children[0].geometry, 10000.)
            objVects.push(objVect)
            if(objVect) {
                count ++
                if(count == objects.length) resolve(objVects)
            }
                             
        }               
    })
    })
  }

  loadObject() {
    return new Promise ((resolve, reject) => {
      var loader = new THREE.OBJLoader(this.manager)
      loader.load( '/sketch-threejs/img/sketch/reel/car.obj', ( object ) => {
        resolve(object)
      })
    })
  }

  changeObj() {
    this.animTime = 0
    this.ParticleSystem.changeModel()
  }
  
  render(renderer, scene, time) {
    
    if (!this.obj) {
      return
    }
    this.animTime++
    console.log(this.animTime)
    if(this.animTime >= 500) {
      this.changeObj()
    }
    this.uniforms.time.value += time;
    this.obj.visible = false;
    this.cubeCamera.update(renderer, scene);
    this.obj.visible = true;
    this.p.rotateY(0.008)
  }
}
