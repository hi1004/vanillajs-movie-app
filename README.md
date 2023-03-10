# ð¦Movie App (TypeScript ver.)

OMDB API ãæ´»ç¨ãã VanillaJs æ ç»æ¤ç´¢ã¢ããªã±ã¼ã·ã§ã³ã§ãã<br>
ãã®ãã­ã¸ã§ã¯ãã¯[JS ãã¼ã¸ã§ã³](https://github.com/hi1004/vanillajs-movie-app/tree/js-only)ã¨[TS ãã¼ã¸ã§ã³](https://github.com/hi1004/vanillajs-movie-app/tree/main)ã§åãããã¦ãã¾ãã<br>
åºæ¬ãã¼ã¸ã§ã³ã¯ TS ã§ãã

[DEMO - OMDBAPI THE OPEN MOVIE APP](https://bit.ly/3I7thE2)
![Screenshot](/src/images/screenshot_domo.png)

<br>
<hr?
<br>

![gif](/src/images/demo.gif)

<details>
	<summary><b>ã³ã¼ãã§è¦ãã³ã¢æ©è½</b></summary>

### Reset.css

ãã©ã¦ã¶ã®åºæ¬ã¹ã¿ã¤ã«ãåæåãã¾ãã

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css"
/>
```
	

### Google Fonts

[Oswald](https://fonts.google.com/specimen/Oswald?query=oswa), [Roboto](https://fonts.google.com/specimen/Roboto?query=robo) ãã©ã³ããä½¿ãã¾ãã

```html
<link
  href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Roboto:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

## Vercel Hosting

`node-fetch` ããã±ã¼ã¸ã¯ 2 ãã¼ã¸ã§ã³ã§ã¤ã³ã¹ãã¼ã«ãã¾ãã

```bash
$ npm i -D vercel dotenv
$ npm i node-fetch@2
```

**/vercel.json**

```json
{
  "devCommand": "npm run dev",
  "buildCommand": "npm run build"
}
```

**/package.json**

```json
{
  "scripts": {
    "vercel": "vercel dev"
  }
}
```

## Vercel Serverless Functions

ãã­ã¸ã§ã¯ãã«ã¼ããã¹ã« `/api` ãã©ã«ããä½æãã
API Key ãé²åºããªãããã«ãµã¼ãã¼ã¬ã¹é¢æ°ãä½æãã¾ãã

**/api/movie.ts**

```ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const { APIKEY } = process.env;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { title, page, id } = JSON.parse(request.body as string);
  const url = id
    ? `https://www.omdbapi.com/?apikey=${APIKEY}&i=${id}&plot=full`
    : `https://www.omdbapi.com/?apikey=${APIKEY}&s=${title}&page=${page}`;
  const res = await fetch(url);
  const json = await res.json();
  response.status(200).json(json);
}
```

## TypeScript

TypeScript ã³ã¢ããã±ã¼ã¸ã¨ `node-fetch` ã®ã¿ã¤ãã³ã°ããã±ã¼ã¸ãã¤ã³ã¹ãã¼ã«ãã¾ãã

```bash
$ npm i -D typescript @types/node-fetch@2
```

**/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ESNext",
    "lib": ["ESNext", "DOM"],
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "api/**/*.ts"]
}
```

## 1. Component

**/core/core.ts**

```ts
///// Component /////
interface ComponentPayload {
  tagName?: string;
  props?: {
    [key: string]: unknown;
  };
  state?: {
    [key: string]: unknown;
  };
}

export class Component {
  public el; // ã³ã³ãã¼ãã³ãã®æä¸ä½è¦ç´ 
  public props; // ã³ã³ãã¼ãã³ããä½¿ç¨ãããæã«è¦ªã³ã³ãã¼ãã³ãããåä¿¡ãããã¼ã¿
  public state; // ã³ã³ãã¼ãã³ãåã§ä½¿ç¨ãããã¼ã¿
  constructor(payload: ComponentPayload = {}) {
    const {
      tagName = 'div', // æä¸ä½è¦ç´ ã®ã¿ã°å
      props = {},
      state = {},
    } = payload;
    this.el = document.createElement(tagName);
    this.props = props;
    this.state = state;
    this.render();
  }
  render() {
    // ã³ã³ãã¼ãã³ããã¬ã³ããªã³ã°ããé¢æ°
    // ...
  }
}
```

## 2. Router

**/core/core.ts**

```ts
///// Router /////
interface Route {
  path: string;
  component: typeof Component;
}
type Routes = Route[];

// ãã¼ã¸ã¬ã³ããªã³ã°!
function routeRender(routes: Routes) {
  // æ¥ç¶ããæãããã·ã¥ã¢ã¼ãã§ãªããã°ï¼ããã·ã¥ããªããã°ï¼/#/ã«ãªãã¤ã¬ã¯ãï¼
  if (!location.hash) {
    history.replaceState(null, '', '/#/'); // ï¼ç¶æãã¿ã¤ãã«ãä½æï¼
  }
  const routerView = document.querySelector('router-view');
  const [hash, queryString = ''] = location.hash.split('?'); // ã¯ã¦ãªãã¼ã¯ã«åºã¥ãã¦ããã·ã¥æå ±ã¨ã¯ã¨ãªã¹ããªã³ã°ãåºå

  // 1) ã¯ã¨ãªã¼ã¹ããªã³ã°ããªãã¸ã§ã¯ãã«å¤æãã¦ãã¹ããªã¼ã®ç¶æã«ä¿å­ï¼
  interface Query {
    [key: string]: string;
  }
  const query = queryString.split('&').reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {} as Query);
  history.replaceState(query, ''); //ï¼ç¶æãã¿ã¤ãã«)

  // 2) ç¾å¨ã®routeræå ±ãè¦ã¤ãã¦ã¬ã³ããªã³ã°!
  const currentRoute = routes.find(route =>
    new RegExp(`${route.path}/?$`).test(hash)
  );
  if (routerView) {
    routerView.innerHTML = '';
    currentRoute && routerView.append(new currentRoute.component().el);
  }

  // 3) ç»é¢åºåå¾ãã¹ã¯ã­ã¼ã«ä½ç½®å¾©æ§ï¼
  window.scrollTo(0, 0);
}
export function createRouter(routes: Routes) {
  // å¥½ããªã¨ããããå¼ã³åºããããã«é¢æ°ãã¼ã¿ãè¿å´ï¼
  return function () {
    window.addEventListener('popstate', () => {
      routeRender(routes);
    });
    routeRender(routes);
  };
}
```

## 3. Store

**/core/core.ts**

```ts
///// Store /////
interface StoreObservers {
  [key: string]: SubscribeCallback[];
}
interface SubscribeCallback {
  (arg: unknown): void;
}

export class Store<S> {
  public state = {} as S; // ç¶æ(ãã¼ã¿)
  private observers = {} as StoreObservers; // ã¹ãã¼ã¿ã¹å¤æ´æ¤åºã«ããå®è¡ããã³ã¼ã«ããã¯
  constructor(state: S) {
    for (const key in state) {
      // åç¶æã«å¯¾ããå¤æ´ç£è¦(Setter)è¨­å®ï¼
      Object.defineProperty(this.state, key, {
        // Getter
        get: () => state[key],
        // Setter
        set: val => {
          state[key] = val;
          if (Array.isArray(this.observers[key])) {
            // å¼ã³åºãã³ã¼ã«ããã¯ãããå ´åï¼
            this.observers[key].forEach(observer => observer(val));
          }
        },
      });
    }
  }
  // ã¹ãã¼ã¿ã¹å¤æ´è³¼èª­ï¼
  subscribe(key: string, cb: SubscribeCallback) {
    Array.isArray(this.observers[key]) // ç»é²æ¸ã¿ã³ã¼ã«ããã¯ããããç¢ºèªï¼
      ? this.observers[key].push(cb) // ããã°æ°ããã³ã¼ã«ããã¯æ¼ãè¾¼ã¿ï¼
      : (this.observers[key] = [cb]); // ãªããã°ã³ã¼ã«ããã¯éåã§å²ãå½ã¦ï¼
  }
}
```

## 4. ã¹ã±ã«ãã³ã¹ã¯ãªã¼ã³ã¨é«è§£ååº¦æ ç»ãã¹ã¿ã¼

**/routes/Movie.ts**

```ts
this.el.classList.add('container', 'the-movie');
// ã¹ã±ã«ãã³ã¹ã¯ãªã¼ã³ åºå!
this.el.innerHTML = /* html */ `
      <div class="poster skeleton"></div>
      <div class="specs">
        <div class="title skeleton"></div>
        <div class="labels skeleton"></div>
        <div class="plot skeleton"></div>
      </div>
    `;
// æ ç»ã®è©³ç´°æå ±ãåå¾ï¼
await getMovieDetails(history.state.id);
const { movie } = movieStore.state;
const bigPoster = movie.Poster.replace('SX300', 'SX700');
```

</details>


## â ï¸TroubleShooting

<details>
  <summary>1. OPEN APIãè¦è«ããæã500 Internal Server Error ã¤ã·ã¥ã¼</summary>
  
  ### ð¤ Issue  
  - **Client**ããOPEN APIè¦è«ãéã£ããã`500 Internal Server Error`ãçºçã
  ![Issue](/src/images/module_issue.png)
  ### â Solution
  - ESã¢ã¸ã¥ã¼ã«ã®ãã¼ã¸ã§ã³ãéãããã­ã¸ã§ã¯ãã§é©ç¨ãããªãã£ããã¼ã¸ã§ã³ã¤ã·ã¥ã¼ãçºçã
  - ESã¢ã¸ã¥ã¼ã«ãã­ã¼ãããã«ã¯ã`package.json`ãã `type': "module"`ãè¨­å®ã
</details>
<details>
  <summary>2. MovieListMore Buttonãæ¶ããã¤ã·ã¥ã¼</summary>
  
  ### ð¤ Issue  
  - æ ç»ãæ¤ç´¢ããå¾ãä»ã®ãã¼ã¸ã«ç§»åããã¨`MovieListMoreã³ã³ãã¼ãã³ãã®ãã¿ã³`ãæ¶ããã¤ã·ã¥ã¼
  ### â Solution
  ```ts
  render() {
   // ....
   const { page, pageMax } = movieStore.state;
    pageMax > page
      ? this.el.classList.remove('hide')
      : this.el.classList.add('hide');
   // ....
  }

```
- `renderé¢æ°`ã®ä¸­ã§å®è¡ãããã¹ãã¢ããä¸åã ãå®è¡ããã®ãåé¡`
- ãã¼ã¸ãç§»åããæã«ã¹ãã¢ããç¶æãåå¾ã§ããããã«ãrederé¢æ°ã§ãå®è¡ãããããã«å¦ç½®
</details>
