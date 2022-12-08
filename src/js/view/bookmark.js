import View from './View';
import icons from 'url:../../img/icons.svg';
import preview from './preview.js';
class Bookmark extends View {
  _parenElement = document.querySelector('.bookmarks');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  _generateMarkup() {
    return this._data.map(el => preview.render(el, false)).join('');
  }
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new Bookmark();
