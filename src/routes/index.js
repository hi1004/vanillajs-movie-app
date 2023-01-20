import { createRouter } from '../core/core';
import Home from './Home';
import Movie from './Movie';
import About from './About';
import NotFound from './NotFound';

export default createRouter([
  { path: '#/', component: Home },
  { path: '#/movie', component: Movie },
  { path: '#/about', component: About },
  { path: '.*', component: NotFound },
]);
