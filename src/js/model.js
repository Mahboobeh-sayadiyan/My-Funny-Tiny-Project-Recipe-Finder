import { async } from 'regenerator-runtime';
import { API_URL, API_URL_ALL, PAGE_LOAD, KEY } from './config.js';
import { getJSON, getJSONs, sendJSON } from './helpers.js';
import cloneDeep from 'lodash-es';
export let state = {
  recipe: {},
  bookmarkss: [],
  search: {
    query: '',
    recipes: [],
    page: 1,
    recipePerPage: PAGE_LOAD,
  },
};
const creatRecipeObject = function (recipe) {
  const recp = {
    cooking: recipe.cooking_time,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    id: recipe.id,
    image: recipe.image_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
  return recp;
};
export const loadRecipe = async function (id) {
  try {
    const { recipe } = await getJSON(`${API_URL}${id}?key=${KEY}`);
    state.recipe = creatRecipeObject(recipe);
    if (state.bookmarkss.some(recip => recip.id == id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadRecipes = async function (keyWord) {
  try {
    const { recipes } = await getJSONs(`${API_URL_ALL}${keyWord}&key=${KEY}`);
    state.search.query = keyWord;
    state.search.recipes = recipes.map(recipe => {
      return creatRecipeObject(recipe);
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};
export const uploadRecipe = async function (newRicipe) {
  try {
    let ingredient = [];
    let el;
    for (let i = 1; i < 7; i++) {
      if (newRicipe[`ingredient-${i}`] != '') {
        const arr = newRicipe[`ingredient-${i}`].replaceAll(' ', '').split(',');
        if (arr.length != 3)
          throw new Error(`wrong ingredient format for ingredient${i}`);
        const [quantity, unit, description] = arr;
        el = {
          quantity: quantity == '' ? null : Number(quantity),
          unit,
          description,
        };
      }
      ingredient.push(el);
    }
    const newUserRecipe = {
      cooking_time: newRicipe.cookingTime,
      title: newRicipe.title,
      publisher: newRicipe.publisher,
      source_url: newRicipe.sourceUrl,
      id: 1223565,
      image_url: newRicipe.image,
      servings: +newRicipe.servings,
      ingredients: ingredient,
    };
    const { data } = await sendJSON(`${API_URL}?key=${KEY}`, newUserRecipe);
    state.recipe = creatRecipeObject(data.recipe);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  return state.search.recipes.length > PAGE_LOAD
    ? page * PAGE_LOAD < state.search.recipes.length
      ? state.search.recipes.slice(0 + (page - 1) * PAGE_LOAD, page * PAGE_LOAD)
      : state.search.recipes.slice(0 + (page - 1) * PAGE_LOAD)
    : state.search.recipes;
};

export const changeNewServingState = function (serv = 0) {
  if (serv != 0) {
    if (state.recipe.servings + serv >= 1) {
      state.recipe.servings += serv;
      state.recipe.ingredients = state.recipe.ingredients.map(ingr => {
        return {
          quantity:
            ingr.quantity *
            (state.recipe.servings / (state.recipe.servings - serv)),
          unit: ingr.unit,
          description: ingr.description,
        };
      });
    }
  }
  return state.recipe;
};

export const addBookmark = function (recipe) {
  state.bookmarkss.push(recipe);
  state.recipe.bookmarked = true;
};
export const removeBookmark = function (recipe) {
  const index = state.bookmarkss.findIndex(
    recip => recip.id == state.recipe.id
  );
  state.bookmarkss.splice(index, 1);
  state.recipe.bookmarked = false;
};
