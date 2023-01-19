import { createRouter } from '../core/core';
import Home from './Home';
import Movie from './Movie';

export default createRouter([
  { path: '#/', component: Home },
  { path: '#/movie', component: Movie },
]);
