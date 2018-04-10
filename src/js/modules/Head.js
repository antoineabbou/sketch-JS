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
     
      this.ObjectManager.loadObject(['./img/obj/mask.obj','./img/obj/soccerBall.obj', './img/obj/brain.obj', './img/obj/car.obj', './img/obj/mp3.obj',  './img/obj/skull.obj', './img/obj/head.obj', './img/obj/astronaut.obj', './img/obj/laptop.obj', './img/obj/microscope.obj', './img/obj/cat.obj', './img/obj/htc.obj', './img/obj/xbox.obj', './img/obj/books.obj', './img/obj/man.obj', './img/obj/tree.obj', './img/obj/arm.obj', './img/obj/DNA.obj', './img/obj/house.obj', './img/obj/ambulance.obj', './img/obj/heart.obj', './img/obj/camera.obj', './img/obj/gun.obj', './img/obj/art.obj', './img/obj/ball.obj', './img/obj/chess.obj', './img/obj/guitar.obj', './img/obj/spaceship.obj', './img/obj/trump.obj', './img/obj/nike.obj', './img/obj/statue.obj', './img/obj/flower.obj']).then(objects => {
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
