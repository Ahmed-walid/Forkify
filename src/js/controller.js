import * as model from './model.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// Application Logic
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //get the query from the search view
    const query = searchView.getQuery();
    if (!query) return;

    // load the recipes from the model
    await model.loadSearchResults(query);

    // render the results with the results view
    resultsView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const controlPagination = function (goto) {
  resultsView.render(model.getSearchResultPage(goto));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 0) add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 1) update the bookmark button
  recipeView.update(model.state.recipe);

  // 2) render bookmarks in the bookmark view
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // render sucess message
    addRecipeView.renderMessage();

    // render bookmarks view
    bookmarkView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.restoreMarkup();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('🔥', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  model.init();
  bookmarkView.addHandlerLoadBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
