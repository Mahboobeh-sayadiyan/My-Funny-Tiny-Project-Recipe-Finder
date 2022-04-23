import * as model from './model.js';
import recipeView from './views/recipeView.js'; // we can not pass any argument to this object for cunstructor
import resultView from './views/resultView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    ////1- fetch recipe
    const id = window.location.hash.slice(1); //this method return url hash
    if (id == '') return;

    recipeView.renderSpinner();
    await model.loadRecipe(id);
    // this is not top-level await , it doew not block the code, so we should add await manually
    //debugger;
    ///2- render recipe
    recipeView.render(model.changeNewServingState());
    bookmarkView.update(model.state.bookmarkss);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};
const controlServing = function (servingChange) {
  recipeView.update(model.changeNewServingState(servingChange));
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe);
  recipeView.update(model.changeNewServingState());

  localStorage.setItem(
    'recipeBookmarks',
    JSON.stringify(model.state.bookmarkss)
  );
  bookmarkView.render(model.state.bookmarkss);
};
const controlShowBookmarks = function () {
  const storage = localStorage.getItem('recipeBookmarks');
  if (storage) model.state.bookmarkss = JSON.parse(storage);
  bookmarkView.render(model.state.bookmarkss);
};
const searchResultUpdate = function () {
  resultView.update(model.getSearchResultPage(model.state.search.page));
};

const controlAddrecipe = async function (data) {
  try {
    await model.uploadRecipe(data);
    addRecipeView.uploadSuccess();
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    bookmarkView.render(model.state.bookmarkss);
    setTimeout(function () {
      controlShowNewRecipe();
      addRecipeView.showCloseWindow();
    }, 2000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};
const controlShowNewRecipe = function () {
  recipeView.render(model.changeNewServingState());
};

const controlSearchResult = async function () {
  try {
    ////1- fetch recipes
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    await model.loadRecipes(query);

    //2- render result & pagination
    resultView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (error) {
    resultView.renderError();
  }
};

const controlPagination = function (gotoPage) {
  resultView.render(model.getSearchResultPage(gotoPage));
  paginationView.render(model.state.search);
};

const init = function () {
  controlShowBookmarks();
  recipeView.addHandlerRender(controlRecipe, controlServing, controlBookmark);
  searchView.addHandlerRender(controlSearchResult);
  paginationView.addHandlerRender(controlPagination);
  resultView.addHandlerRender(searchResultUpdate);
  addRecipeView.addHandlerRender(controlAddrecipe);
  console.log('Hello');
  console.log('where are you from?');
};
init();
