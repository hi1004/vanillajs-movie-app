import { Store } from '../core/core';

interface State {
  photo: string;
  name: string;
  email: string;
  blog: string;
  github: string;
  repository: string;
}

export default new Store<State>({
  photo:
    'https://github.com/hi1004/United-IT-Promotion/blob/master/src/assets/executives/executives5.gif?raw=true',
  name: 'HI1004 / OhByeongHeon',
  email: 'byorusia@gmail.com',
  blog: 'https://velog.io/@kipo09',
  github: 'https://github.com/hi1004',
  repository: 'https://github.com/hi1004/vanillajs-movie-app',
});
