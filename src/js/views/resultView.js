import View from './view.js';
import icons from 'url:../../img/icons.svg  ';
import PreviewView from './previewView.js';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _error =
    'We could not find any recipe, try another keyword for search recipe.';
  _generateMarkup() {
    return this._data
      .map(element => PreviewView.render(element, false))
      .join('');
  }
  addHandlerRender(searchResultUpdate) {
    window.addEventListener('hashchange', searchResultUpdate);
  }
}
export default new ResultView();
