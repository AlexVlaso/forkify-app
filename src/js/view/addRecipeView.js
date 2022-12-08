import View from './View';

class AddRecipeView extends View {
  _parenElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Your recipe was added successfully :)';
  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
  }
  windowtoggle() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpenWindow() {
    this._btnOpen.addEventListener('click', this.windowtoggle.bind(this));
  }
  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.windowtoggle.bind(this));
    this._overlay.addEventListener('click', this.windowtoggle.bind(this));
  }
  _addHandlerSubmitRecipe(handler) {
    this._parenElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
