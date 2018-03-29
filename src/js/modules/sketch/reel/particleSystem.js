const glslify = require('glslify');


class particleSystem {
    constructor(params) {
        this.count = params.count 
        this.objBuffers = params.objBuffers

        this.oldBuffer = null
        this.oldBufferId = null
        this.currentBufferId = null
        this.currentBuffer = null

        this.initParticles()       
    }

    initParticles() {
        this.geometry = new THREE.BufferGeometry()
        this.currentBufferId = 0
        this.currentBuffer = this.objBuffers[this.currentBufferId]
        this.rank = new Float32Array(this.count)
        this.startPos = new Float32Array(this.count*3)
        let startPosIterator = 0
        let rankIterator = 0
        for(let i = 0; i<this.count; i++) {
            this.rank[rankIterator++] = i

            this.startPos[startPosIterator++] = Math.random()*5-2.5
            this.startPos[startPosIterator++] = Math.random()*5-2.5
            this.startPos[startPosIterator++] = 2
        }
        
        this.uniforms = {
            beginAnimTime: {
                type:"f",
                value:0
            },
            u_time: {
                type:"f",
                value:0
            },
            ray: {
                type:"v3",
                value:0
            }
        }

        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.currentBuffer,3))
        this.geometry.addAttribute('currentBuffer', new THREE.BufferAttribute(this.currentBuffer,3))
        this.geometry.addAttribute('oldBuffer', new THREE.BufferAttribute(this.startPos,3))
        this.geometry.addAttribute('startPos', new THREE.BufferAttribute(this.startPos,3))
        this.geometry.addAttribute('rank', new THREE.BufferAttribute(this.rank,1))
        this.material = new THREE.ShaderMaterial({
            vertexShader: glslify('../../../../glsl/sketch/reel/particles.vs'),
            fragmentShader: glslify('../../../../glsl/sketch/reel/particles.fs'),
            uniforms: this.uniforms, 
        })

        this.mesh = new THREE.Points(this.geometry, this.material)
        
    }

    generateRandom(min, max) {
        let  num = Math.floor(Math.random() * (max - min + 1)) + min;
        return (num === this.oldBufferId) ? this.generateRandom(min, max) : num;        
    }

    changeModel() {
        // console.log('am doing somethign here', this.currentBufferId)
        this.oldBufferId = this.currentBufferId
        // console.log(this.objBuffers)
        this.mesh.geometry.attributes.oldBuffer.array = this.objBuffers[this.oldBufferId]
        
        if(this.oldBufferId == this.objBuffers.length-1) {
            this.currentBufferId = 0
        }else {
            this.currentBufferId = this.oldBufferId + 1
        }
    
        // console.log('current id', this.currentBufferId)
        
        console.log('//////////')
        console.log('test', this.mesh.geometry.attributes.currentBuffer.array)
        console.log('objbuffers', this.objBuffers[this.currentBufferId])
        this.mesh.geometry.attributes.currentBuffer.array = this.objBuffers[this.currentBufferId]
        
    }
}

export default particleSystem