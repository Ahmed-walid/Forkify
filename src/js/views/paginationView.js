import View from './view.js';
import icons from '../../img/icons.svg';
import { RESULT_PAGE_SIZE } from '../config.js';
import { mark } from 'regenerator-runtime';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');

      // you may click on any white space area at the handler will be triggered :(
      if (!btn) return;

      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numOfPages = Math.ceil(this._data.results.length / RESULT_PAGE_SIZE);

    let markup = '';

    if (currPage - 1 >= 1)
      markup += `
        <button data-goto='${
          currPage - 1
        }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>
        `;

    if (currPage + 1 <= numOfPages)
      markup += `
        <button data-goto='${
          currPage + 1
        }' class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;

    return markup;
  }
}

export default new PaginationView();
