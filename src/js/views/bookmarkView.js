import View from './view.js';
import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg  ';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _error = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _generateMarkup() {
    return this._data
      .map(element => PreviewView.render(element, false))
      .join('');
    //if we had no bookmark we will have error
  }
}
export default new BookmarkView();
