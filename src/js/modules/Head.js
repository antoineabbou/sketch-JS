  import { Geometry } from 'three';

import ObjectManager from './objectManager'
import particleSystem from './particleSystem'
import Emitter from '../init/events'

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
    this.id = null
    Emitter.on('GLOBAL:TOUCH', (id) => {
      this.changeShape = true
      this.id = id
    })
  }

  initParticleSystem(objBuffers) {
    this.ParticleSystem = new particleSystem({count: 35000, objBuffers: objBuffers})
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
     
      this.ObjectManager.loadObject(['/sketch-threejs/img/obj/mask.obj','/sketch-threejs/img/obj/soccerBall.obj', '/sketch-threejs/img/obj/brain.obj', '/sketch-threejs/img/obj/car.obj', '/sketch-threejs/img/obj/mp3.obj',  '/sketch-threejs/img/obj/skull.obj', '/sketch-threejs/img/obj/head.obj', '/sketch-threejs/img/obj/astronaut.obj', '/sketch-threejs/img/obj/laptop.obj', '/sketch-threejs/img/obj/microscope.obj', '/sketch-threejs/img/obj/cat.obj', '/sketch-threejs/img/obj/htc.obj', '/sketch-threejs/img/obj/xbox.obj', '/sketch-threejs/img/obj/books.obj', '/sketch-threejs/img/obj/man.obj', '/sketch-threejs/img/obj/tree.obj', '/sketch-threejs/img/obj/arm.obj', '/sketch-threejs/img/obj/DNA.obj', '/sketch-threejs/img/obj/house.obj', '/sketch-threejs/img/obj/ambulance.obj', '/sketch-threejs/img/obj/heart.obj', '/sketch-threejs/img/obj/camera.obj', '/sketch-threejs/img/obj/gun.obj', '/sketch-threejs/img/obj/art.obj', '/sketch-threejs/img/obj/ball.obj', '/sketch-threejs/img/obj/chess.obj', '/sketch-threejs/img/obj/guitar.obj', '/sketch-threejs/img/obj/spaceship.obj', '/sketch-threejs/img/obj/trump.obj', '/sketch-threejs/img/obj/nike.obj', '/sketch-threejs/img/obj/statue.obj', '/sketch-threejs/img/obj/flower.obj']).then(objects => {
        let count = 0
        let objVects = []
        for (let i = 0; i < objects.length; i++) {
            this.objects = objects
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

  changeObj(id) {
    this.animTime = 0
    this.changeShape = false
    this.ParticleSystem.changeModel(id)
  }
  
  render(renderer, scene, time) {

    this.animTime++
    if(this.ParticleSystem) {
    
      this.ParticleSystem.mesh.geometry.attributes.oldBuffer.needsUpdate = true
      this.ParticleSystem.mesh.geometry.attributes.currentBuffer.needsUpdate = true 
      this.ParticleSystem.mesh.material.uniforms.beginAnimTime.value = this.animTime
      this.ParticleSystem.mesh.rotateY(0.01)

    }

    
    if(this.changeShape) {
      this.ParticleSystem.mesh.material.uniforms.beginAnimTime.value = 0
      this.changeObj(this.id)
    }  
  
  
    this.uniforms.time.value += time;
    this.cubeCamera.update(renderer, scene);
   
  }
}
