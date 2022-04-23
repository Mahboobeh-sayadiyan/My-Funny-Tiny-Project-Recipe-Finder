import icons from 'url:../../img/icons.svg  ';
export default class View {
  _data;
  /**
   * render the recieved object to the DOM
   * @param {object | object[]} data the data to be rendered
   * @param {boolean} [render=true] if false creat markup string instead of rendering to DOM
   * @returns {undefined | string} A markup stringis returned if render = false
   * @this {object} View instance
   * @author Mahboobeh
   * @todo finish implementation // what should we do
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    if (!render) return this._generateMarkup();
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup()
    );
  }
  update(data) {
    this._data = data;
    const newMarkUp = this._generateMarkup(); // it is an html string
    const realDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElement = Array.from(realDOM.querySelectorAll('*')); // this returns a nodelist that convert to Array
    const currentElement = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    //actully here we just change content, and for example do not add new div. we just change class, attributes and some thing like this
    newElement.forEach((el, i) => {
      if (
        !el.isEqualNode(currentElement[i]) &&
        el.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElement[i].textContent = el.textContent;
      }
      if (!el.isEqualNode(currentElement[i])) {
        const curEl = currentElement[i];
        const att = Array.from(el.attributes);
        att.forEach(elem => {
          curEl.setAttribute(elem.name, elem.value);
        });
      }
    });
  }

  renderError(errorMessage = this._error) {
    this._parentElement.innerHTML = '';
    const newError = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${errorMessage}</p>
          </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', newError);
  }
  uploadSuccess(Message = this._message) {
    this._parentElement.innerHTML = '';
    const newMessage = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${Message}</p>
          </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', newMessage);
  }

  renderSpinner() {
    this._parentElement.innerHTML = '';
    const spinnner = `
    <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', spinnner);
  }
}
