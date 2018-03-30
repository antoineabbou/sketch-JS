const THREE = require('three/build/three.js');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');
const debounce = require('js-util/debounce');

import force3 from '../../common/force3';
import Core from './Core';
import Wire from './Wire';

import Head from './Head';

var Articles = require('../../../../articles.json')


export default class Boxes {
  constructor() {
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.instances = 36;
    this.core = new Core(this.instances);
    this.wire = new Wire(this.instances);
    this.article = document.querySelector('.p-sketch-outline__article')
  }
  updateRotation() {
    force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, 0.02);
    force3.applyDrag(this.acceleration, 0.3);
    force3.updateVelocity(this.velocity, this.acceleration, 1);
    this.core.uniforms.rotate.value = this.velocity[0];
    this.wire.uniforms.rotate.value = this.velocity[0];
  }
  rotate(delta) {
    if (!delta) return;
    this.anchor[0] -= delta * 0.05;
  }
  picked(id) {
    this.core.uniforms.pickedId.value = id;
    this.wire.uniforms.pickedId.value = id;
    if (id < this.instances && id > -1) {
      if(!Head.launchAnimation) {
        Head.launchAnimation = true
        console.log(Head.launchAnimation)
      }
      document.body.classList.add('is-picked');
      this.article.classList.add('article-show');
      
      Articles.forEach(article => {
        if(id === article.id) {
          this.article.innerHTML = 'Voici l\'article "' + article.id + '", titre : ' + article.title + ' ';
        }
      });
    } else {
      if(Head.launchAnimation) {
        Head.launchAnimation = false
        console.log(Head.launchAnimation)
      }
      document.body.classList.remove('is-picked');
      this.article.classList.remove('article-show')
    }
  }
  render(time) {
    this.core.uniforms.time.value += time;
    this.wire.render(time);
    this.updateRotation();
  }
}
