class SearchView {
  _parentElement = document.querySelector('.search');
  getQuery() {
    const input = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return input;
  }
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandlerRender(controlSearchResult) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      controlSearchResult();
    });
  }
}
export default new SearchView();
