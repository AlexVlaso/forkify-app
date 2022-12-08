import View from './View';
import icons from 'url:../../img/icons.svg';
class PageView extends View {
  _parenElement = document.querySelector('.pagination');
  addHandlerRender(handler) {
    this._parenElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const maxPage = Math.ceil(
      this._data.recipes.length / this._data.resultOnPage
    );
    if (curPage === 1 && curPage < maxPage) {
      return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
       <svg class="search__icon">
         <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    if (curPage > 1 && curPage < maxPage) {
      return `
     <button data-goto="${
       curPage - 1
     }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
     </button>
     <button data-goto="${
       curPage + 1
     }"class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
     </button>`;
    }
    if (curPage === maxPage && curPage > 1) {
      return `
     <button data-goto="${
       curPage - 1
     }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
     </button>`;
    }

    return '';
  }
}
export default new PageView();
