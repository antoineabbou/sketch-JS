import ConsoleSignature from './modules/common/ConsoleSignature.js';
import redirectOldSketches from './modules/common/redirectOldSketches.js';

const page = document.querySelector('.l-page');
const pageId = page.dataset.id;
const consoleSignature = new ConsoleSignature();

const init = () => {
  require('./init/common.js').default();
  if (pageId == 'index') {
    require('./init/index.js').default();
  } else {
    require('./init/commonSketch.js').default();
    switch (pageId) {
      case 'reel':        require('./init/reel.js').default(); break;
      case 'glitch':      require('./init/glitch.js').default(); break;
      default:
    }
  }
  redirectOldSketches();
}

init();
