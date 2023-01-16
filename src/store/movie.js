import { Store } from '../core/core';

const store = new Store({
  searchText: '',
  page: 1,
  movies: [],
});
export default store;
export const searchMovies = async page => {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=7035c60c&s=${store.state.searchText}&page=${page}`
  );
  const json = await res.json();
  console.log(json, res);
};
