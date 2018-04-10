const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');

import normalizeVector2 from '../modules/normalizeVector2';
import Boxes from '../modules/Boxes.js';
import Floor from '../modules/Floor.js';
import Head from '../modules/Head.js';


import {TweenMax, Power2, TimelineLite} from "gsap";

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
  });
  const renderPicked = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const scenePicked = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, document.body.clientWidth / window.innerHeight, 1, 15000);
  const clock = new THREE.Clock();

  const vectorTouchStart = new THREE.Vector2();
  const vectorTouchMove = new THREE.Vector2();
  const vectorTouchMovePrev = new THREE.Vector2();
  const vectorTouchEnd = new THREE.Vector2();
  const pixelBuffer = new Uint8Array(4);

  let isDrag = false;

  let loader = document.querySelector('.container-loader')


  let concept = document.querySelector('.concept')
  let tableOfContents = document.querySelector('.table-of-contents')

  let conceptModal = document.querySelector('.concept-modal')
  let tableModal = document.querySelector('.table-modal')


  let conceptTitle = document.querySelector('.concept-modal .concept')
  let conceptContent = document.querySelector('.concept')

  let staggerConcept = document.querySelectorAll('.concept-modal .stagger')
  let staggerTable = document.querySelectorAll('.table-modal .stagger')

  let showConceptTl = new TimelineLite({
    delay: 0.2
  })

  let showTableTl = new TimelineLite({
    delay: 0.2
  })

  let hideConceptTl = new TimelineLite({
    delay: 0.2
  })

  let hideTableTl = new TimelineLite({
    delay: 0.2
  })

  let closeButtons = document.querySelectorAll('.btn')
  let closeConcept = document.querySelector('.btn-close-concept')
  let closeTable = document.querySelector('.btn-close-table')

  let cursor = document.querySelector('.cursor')

  let items = document.querySelectorAll('.item-container')


  document.addEventListener('mousemove', (e) => {
    cursor.classList.add('is-moving')
    TweenLite.to(cursor, 1, {
      left: e.pageX,
      top: e.pageY,
      ease: Power4.easeOut  
    })
    clearTimeout(timer)

    let timer = setTimeout(() => {
      cursor.classList.remove('is-moving')
    }, 300)
  }) 

  closeButtons.forEach(closeButton => {
    closeButton.addEventListener('mouseover', () => {
      cursor.classList.add('is-black')
    })
    closeButton.addEventListener('mouseout', () => {
      cursor.classList.remove('is-black')
    })
  });

  items.forEach(item => {
    item.addEventListener('mouseover', () => {
      item.classList.add('is-white')
      cursor.classList.add('is-black')
    })
    item.addEventListener('mouseout', () => {
      item.classList.remove('is-white')
      cursor.classList.remove('is-black')
    })
  })
  //
  // process for this sketch.
  //

  const boxes = new Boxes();
  const floor = new Floor();
  const head = new Head();

  //
  // common process
  //
  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    camera.aspect = document.body.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderPicked.setSize(document.body.clientWidth, window.innerHeight);
    floor.resize();
  }
  const render = () => {
    const time = clock.getDelta();
    renderer.setClearColor(0x1a1a1a, 1.0);
    boxes.render(time);
   
    floor.render(renderer, scene, time);
    head.render(renderer, scene, time);
    renderer.render(scene, camera);
  }
  const renderLoop = () => {
    render();
    
    requestAnimationFrame(renderLoop);
  }
  const touchStart = (isTouched) => {
    isDrag = true;
  };
  const touchMove = (isTouched) => {
    if (isDrag) {
      if (isTouched) {
        boxes.rotate((vectorTouchMove.x - vectorTouchMovePrev.x) * 2);
      }
    } else {
      renderer.setClearColor(0x1a1a1a, 1.0);
      renderer.render(scenePicked, camera, renderPicked);
      renderer.readRenderTargetPixels(renderPicked, vectorTouchMove.x, renderPicked.height - vectorTouchMove.y, 1, 1, pixelBuffer);
      boxes.picked((pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]));
    }
  };
  const touchEnd = (isTouched) => {
    isDrag = false;
  };
  const wheel = (event) => {
    boxes.rotate(event.deltaY);
  }

  const onClick = () => {
    boxes.picked((pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]), true);
  };

  const on = () => {
    window.addEventListener('resize', debounce(() => {
      resizeWindow();
    }), 1000);
    canvas.addEventListener('mousedown', function (event) {
      event.preventDefault();
      vectorTouchStart.set(event.clientX, event.clientY);
      touchStart(false);
    });
    document.addEventListener('mousemove', function (event) {
      event.preventDefault();
      vectorTouchMove.set(event.clientX, event.clientY);
      touchMove(false);
    });
    document.addEventListener('mouseup', function (event) {
      event.preventDefault();
      vectorTouchEnd.set(event.clientX, event.clientY);
      touchEnd(false);
    });
    canvas.addEventListener('wheel', function(event) {
      event.preventDefault();
      wheel(event);
    });
    canvas.addEventListener('touchstart', function (event) {
      event.preventDefault();
      vectorTouchStart.set(event.touches[0].clientX, event.touches[0].clientY);
      vectorTouchMove.set(event.touches[0].clientX, event.touches[0].clientY);
      vectorTouchMovePrev.set(event.touches[0].clientX, event.touches[0].clientY);
      touchStart(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchmove', function (event) {
      event.preventDefault();
      vectorTouchMove.set(event.touches[0].clientX, event.touches[0].clientY);
      touchMove(true);
      vectorTouchMovePrev.set(event.touches[0].clientX, event.touches[0].clientY);
    });
    canvas.addEventListener('touchend', function (event) {
      event.preventDefault();
      vectorTouchEnd.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      touchEnd(true);
    });
    canvas.addEventListener("click", function (e) {
      onClick()
    });
  }

  const audioManager = () => {
    let audio = new Audio()    
    let i = 0
    let playlist = new Array('../../img/sounds/audio.mp3', '../../img/sounds/audio-2.mp3', '../../img/sounds/audio-3.mp3', '../../img/sounds/audio-4.mp3')

    audio.addEventListener('ended', () => {
      i = ++i < playlist.length ? i : 0
      audio.src = playlist[i]
      audio.play()
    }, true)
    audio.volume = 0.4
    audio.src = playlist[0]
    audio.play()
  }

  const addListeners = () => {
    concept.addEventListener('click', () => {
      showConceptTl.to(conceptModal, 1, {
        xPercent: 100,
        transformOrigin: '100%',
        ease: Quint.easeInOut,
      })
      showConceptTl.staggerFrom(staggerConcept, 1.3, {
        cycle: {
          x: (i) => {
            return - (i + 1) * 20
          }
        },
        alpha: 0,
        ease: Expo.easeOut,
        clearProps: 'opacity'
      }) 
    })
    
    tableOfContents.addEventListener('click', () => {
      console.log('hello')
      showTableTl.to(tableModal, 1, {
        xPercent: -100,
        transformOrigin: '100%',
        ease: Quint.easeInOut,
      })
      showTableTl.staggerFrom(staggerTable, 1.3, {
        cycle: {
          x: (i) => {
            return (i + 1) * 20
          }
        },
        alpha: 0,
        ease: Expo.easeOut,
        clearProps: 'opacity'
      }) 
      
    })

    closeConcept.addEventListener('click', () => {
      hideConceptTl.to(conceptModal, 1, {
        xPercent: -100,
        transformOrigin: '100%',
        ease: Quint.easeInOut,
        onComplete: () => {
        }
      })
    })

    
    closeTable.addEventListener('click', () => {
      hideTableTl.to(tableModal, 1, {
        xPercent: 100,
        transformOrigin: '100%',
        ease: Quint.easeInOut,
        onComplete: () => {
        }
      })
    })
  
  } 

  const init = () => {
    audioManager()
    addListeners()

    renderer.setSize(document.body.clientWidth, window.innerHeight);
    camera.position.set(0, 600, -3000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    floor.mirrorCamera.position.set(0, -600, -3000);
    floor.mirrorCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.newTime = 0
    boxes.core.obj.position.set(0, 80, 0);
    boxes.wire.obj.position.set(0, 80, 0);
    boxes.wire.objPicked.position.set(0, 80, 0);
    floor.obj.rotation.set(-0.5 * Math.PI, 0, 0)

    

    head.init().then(mesh => {
      let hideLoaderTl = new TimelineLite({
        delay: 2,
      })

      scene.add(mesh)
      scene.add(boxes.core.obj);
      scene.add(boxes.wire.obj);
      scene.add(floor.obj);
      scene.add(head.cubeCamera);
      scenePicked.add(boxes.wire.objPicked);
      mesh.scale.set(300, 300, 300)
      mesh.position.y = 300
      
      hideLoaderTl.to(loader, 1, {
        yPercent: 100,
        transformOrigin: '100%',
        ease: Quint.easeInOut,
        onComplete: () => {
          
        }
      })
    })

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
