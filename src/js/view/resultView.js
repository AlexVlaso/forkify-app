import View from './View';
import icons from 'url:../../img/icons.svg';
import preview from './preview.js';
class ResultView extends View {
  _parenElement = document.querySelector('.results');
  _errorMessage = 'We can not find this query. Please, try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(el => preview.render(el, false)).join('');
  }
}

export default new ResultView();
