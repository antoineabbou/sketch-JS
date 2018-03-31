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
    this.launchAnimation = false
  }

  initParticleSystem(objBuffers) {
    this.ParticleSystem = new particleSystem({count: 35000, objBuffers: objBuffers})
    console.log('ok')
    return this.ParticleSystem.mesh 
  }

  init() {
    return new Promise(resolve => {
      this.transform().then(objBuffers => {
        this.ParticleSystem = new particleSystem({count: 35000, objBuffers: objBuffers})
        // this.render()
     
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
              console.log('ok')
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
     
      this.ObjectManager.loadObject(['/sketch-threejs/img/sketch/reel/mask.obj','/sketch-threejs/img/sketch/reel/soccerBall.obj', '/sketch-threejs/img/sketch/reel/brain.obj', '/sketch-threejs/img/sketch/reel/car.obj', '/sketch-threejs/img/sketch/reel/mp3.obj',  '/sketch-threejs/img/sketch/reel/skull.obj', '/sketch-threejs/img/sketch/reel/head.obj', '/sketch-threejs/img/sketch/reel/astronaut.obj', '/sketch-threejs/img/sketch/reel/laptop.obj', '/sketch-threejs/img/sketch/reel/microscope.obj', '/sketch-threejs/img/sketch/reel/cat.obj', '/sketch-threejs/img/sketch/reel/htc.obj', '/sketch-threejs/img/sketch/reel/xbox.obj', '/sketch-threejs/img/sketch/reel/books.obj', '/sketch-threejs/img/sketch/reel/man.obj', '/sketch-threejs/img/sketch/reel/tree.obj', '/sketch-threejs/img/sketch/reel/arm.obj', '/sketch-threejs/img/sketch/reel/DNA.obj', '/sketch-threejs/img/sketch/reel/house.obj', '/sketch-threejs/img/sketch/reel/ambulance.obj', '/sketch-threejs/img/sketch/reel/heart.obj', '/sketch-threejs/img/sketch/reel/camera.obj', '/sketch-threejs/img/sketch/reel/gun.obj', '/sketch-threejs/img/sketch/reel/art.obj', '/sketch-threejs/img/sketch/reel/ball.obj', '/sketch-threejs/img/sketch/reel/chess.obj', '/sketch-threejs/img/sketch/reel/guitar.obj', '/sketch-threejs/img/sketch/reel/spaceship.obj', '/sketch-threejs/img/sketch/reel/trump.obj', '/sketch-threejs/img/sketch/reel/nike.obj', '/sketch-threejs/img/sketch/reel/statue.obj', '/sketch-threejs/img/sketch/reel/flower.obj']).then(objects => {
        let count = 0
        let objVects = []
        for (let i = 0; i < objects.length; i++) {
            this.objects = objects
            console.log(this.objects)
            let objVect = GeometryUtils.default.randomPointsInGeometry( objects[i].children[0].geometry, 35000.)
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
    
    // if (!this.obj) {
    //   return
    // }
    //console.log(this.ParticleSystem)
    this.animTime++
    if(this.ParticleSystem) {
    
      this.ParticleSystem.mesh.geometry.attributes.oldBuffer.needsUpdate = true
      this.ParticleSystem.mesh.geometry.attributes.currentBuffer.needsUpdate = true 
      this.ParticleSystem.mesh.material.uniforms.beginAnimTime.value = this.animTime
      this.ParticleSystem.mesh.rotateY(0.01)

    }
    
  
    if(this.animTime >= 150) {
      console.log(this.ParticleSystem)
      this.ParticleSystem.mesh.material.uniforms.beginAnimTime.value = 0
      this.changeObj()
    }
    this.uniforms.time.value += time;
    // this.obj.visible = false;
    this.cubeCamera.update(renderer, scene);
    // this.obj.visible = true;
   
  }
}
