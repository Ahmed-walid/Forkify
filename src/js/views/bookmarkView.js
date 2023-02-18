import View from './view.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';

  addHandlerLoadBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarkView();
