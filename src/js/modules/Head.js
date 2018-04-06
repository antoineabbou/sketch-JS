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

    Emitter.on('GLOBAL:SHOW', () => {
      this.showModal = true
    })
    Emitter.on('GLOBAL:HIDE', () => {
      this.showModal = false
    })
    Emitter.on('GLOBAL:TOUCH', (id) => {
      if(!this.showModal) {
        this.changeShape = true
        this.id = id
      }
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
     
      this.ObjectManager.loadObject(['/machine-learning/img/obj/mask.obj','/machine-learning/img/obj/soccerBall.obj', '/machine-learning/img/obj/brain.obj', '/machine-learning/img/obj/car.obj', '/machine-learning/img/obj/mp3.obj',  '/machine-learning/img/obj/skull.obj', '/machine-learning/img/obj/head.obj', '/machine-learning/img/obj/astronaut.obj', '/machine-learning/img/obj/laptop.obj', '/machine-learning/img/obj/microscope.obj', '/machine-learning/img/obj/cat.obj', '/machine-learning/img/obj/htc.obj', '/machine-learning/img/obj/xbox.obj', '/machine-learning/img/obj/books.obj', '/machine-learning/img/obj/man.obj', '/machine-learning/img/obj/tree.obj', '/machine-learning/img/obj/arm.obj', '/machine-learning/img/obj/DNA.obj', '/machine-learning/img/obj/house.obj', '/machine-learning/img/obj/ambulance.obj', '/machine-learning/img/obj/heart.obj', '/machine-learning/img/obj/camera.obj', '/machine-learning/img/obj/gun.obj', '/machine-learning/img/obj/art.obj', '/machine-learning/img/obj/ball.obj', '/machine-learning/img/obj/chess.obj', '/machine-learning/img/obj/guitar.obj', '/machine-learning/img/obj/spaceship.obj', '/machine-learning/img/obj/trump.obj', '/machine-learning/img/obj/nike.obj', '/machine-learning/img/obj/statue.obj', '/machine-learning/img/obj/flower.obj']).then(objects => {
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
