import View from './view.js';
import icons from 'url:../../img/icons.svg  ';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _currentPage;
  getCurrenPage() {
    return this._currentPage;
  }
  _creatPrevButton(page) {
    return `
    <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
     <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${page - 1}</span>
    </button>`;
  }
  _creatNextButton(page) {
    return `
    <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
    <svg class="search__icon">
     <use href="${icons}#icon-arrow-right"></use>
    </svg>
    <span>Page ${page + 1}</span>
    </button>`;
  }
  _generateMarkup() {
    let btn = '';
    this._currentPage = this._data.page;
    const numberOfPages = Math.ceil(
      this._data.recipes.length / this._data.recipePerPage
    );
    const nextBt = this._creatNextButton(this._currentPage);
    const prevBt = this._creatPrevButton(this._currentPage);

    //firstpage
    if (this._currentPage == 1 && numberOfPages > 1) btn = nextBt;
    //lastpage
    else if (this._currentPage == numberOfPages && numberOfPages > 1)
      btn = prevBt;
    //midlepage
    else if (this._currentPage < numberOfPages && this._currentPage > 1) {
      btn = prevBt + nextBt;
    }
    return btn;
  }
  addHandlerRender(controlPagination) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (btn != null) controlPagination(Number(btn.dataset.goto));
    });
  }
}
export default new PaginationView();
