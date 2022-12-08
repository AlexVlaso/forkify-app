import { async } from 'regenerator-runtime';
import { API_URL, RES_ON_PAGE, KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    recipes: [],
    resultOnPage: RES_ON_PAGE,
    page: 1,
  },
  bookmarks: [],
};
function createRecipe(data) {
  let recipe = data.data.recipe;

  state.recipe = {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
}
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    createRecipe(data);

    if (state.bookmarks.some(el => el.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function loadSearchRecipes(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.recipes = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function getResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultOnPage;
  const end = page * state.search.resultOnPage;
  return state.search.recipes.slice(start, end);
}
export function updateServering(newServering) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServering) / state.recipe.servings;
  });
  state.recipe.servings = newServering;
}
function persistBookmark() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export function addBookmark(recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
}
export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
}
export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length != 3)
          throw Error('Wrong ingredient format. Please try again');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients: ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    createRecipe(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}

init();
