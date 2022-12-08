import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';
import pageView from './view/pageView.js';
import bookmarkView from './view/bookmark.js';
import addRecipeView from './view/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function renderRecipe() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultView.update(model.getResultsPage());
    bookmarkView.update(model.state.bookmarks);
    ////1 Loading data
    await model.loadRecipe(id);
    ////2 Render view
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}
async function renderSearchRecipes() {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchRecipes(query);
    resultView.render(model.getResultsPage());
    pageView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
}
function controlPagination(page) {
  resultView.render(model.getResultsPage(page));
  pageView.render(model.state.search);
}
function controlServering(servering) {
  model.updateServering(servering);
  recipeView.update(model.state.recipe);
}
function controlAddBookmarks() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  bookmarkView.render(model.state.bookmarks);

  recipeView.update(model.state.recipe);
}
function controlBookmarks() {
  bookmarkView.render(model.state.bookmarks);
}
async function controlAddNewRecipe(newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);

    addRecipeView.renderMessage();
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.windowtoggle();
    }, 1500);
    recipeView.render(model.state.recipe);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}
function init() {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(renderRecipe);
  recipeView.addHandlerRenderServering(controlServering);
  recipeView.addHandlerRenderBookmark(controlAddBookmarks);
  searchView.addHandlerRender(renderSearchRecipes);
  pageView.addHandlerRender(controlPagination);
  addRecipeView._addHandlerSubmitRecipe(controlAddNewRecipe);
  console.log('Welcome!');
}
init();
