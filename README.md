# 🎦Movie App (JavaScript ver.)

OMDB API を活用した VanillaJs 映画検索アプリケーションです。
このプロジェクトは[JS バージョン](https://github.com/hi1004/vanillajs-movie-app/tree/js-only)と[TS バージョン](https://github.com/hi1004/vanillajs-movie-app/tree/main)で分けられています。
基本バージョンは TS です。

[DEMO - OMDBAPI THE OPEN MOVIE APP](https://ts-movie-app-umber.vercel.app/#/)

![Screenshot](/src/images/demo.gif)

<details>
	<summary><b>コードで見るコア機能</b></summary>

### Reset.css

ブラウザの基本スタイルを初期化します。

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css"
/>
```

### Google Fonts

[Oswald](https://fonts.google.com/specimen/Oswald?query=oswa), [Roboto](https://fonts.google.com/specimen/Roboto?query=robo) フォントを使います。

```html
<link
  href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Roboto:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

## Vercel Hosting

`node-fetch` パッケージは 2 バージョンでインストールします。

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

プロジェクトルートパスに `/api` フォルダを作成し、
API Key を露出しないようにサーバーレス関数を作成します。

**/api/movie.js**

```js
import fetch from 'node-fetch';

const { APIKEY } = process.env;

export default async function handler(request, response) {
  const { title, page, id } = JSON.parse(request.body);
  const URL = id
    ? `https://www.omdbapi.com?apikey=${APIKEY}&i=${id}&plot=full`
    : `https://www.omdbapi.com/?apikey=${APIKEY}&s=${title}&page=${page}`;
  const res = await fetch(URL);
  const json = await res.json();
  response.status(200).json(json);
}
```

## 1. Component

**/core/core.js**

```js
//// Component ////
export class Component {
  constructor(payload = {}) {
    const { tagName = 'div', state = {}, props = {} } = payload;
    this.el = document.createElement(tagName);
    this.state = state;
    this.props = props;
    this.render();
  }
  render() {}
}
```

## 2. Router

**/core/core.js**

```js
//// Router(ページレンダリング!) ////
const routeRender = routes => {
  // 接続する時、ハッシュモードでなければ（ハッシュがなければ）/#/にリダイレクト！
  if (!location.hash) history.replaceState(null, '', '/#/'); //（状態、タイトル、住所）

  const routerView = document.querySelector('router-view');
  const [hash, queryString = ''] = decodeURI(location.hash).split('?'); // はてなマークに基づいてハッシュ情報とクエリストリングを区分

  // 1) クエリーストリングをオブジェクトに変換してヒストリーの状態に保存！
  const query = queryString.split('&').reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {});
  history.replaceState(query, ''); // (상태, 제목)

  // 2) 現在のrouter情報を見つけてレンダリング!
  const currentRoute = routes.find(route =>
    new RegExp(`${route.path}/?$`).test(hash)
  );
  routerView.innerHTML = '';
  routerView.append(new currentRoute.component().el);

  // 3) 画面出力後、スクロール位置復旧！
  window.scrollTo(0, 0);
};

export function createRouter(routes) {
  // 好きなところから呼び出せるように関数データを返却！
  return () => {
    window.addEventListener('popstate', () => {
      routeRender(routes);
    });
    routeRender(routes);
  };
}
```

## 3. Store

**/core/core.js**

```js
//// Store ////
export class Store {
  constructor(state) {
    this.state = {}; // 状態(データ)
    this.observers = {};
    for (const key in state) {
      // 各状態に対する変更監視(Setter)設定！
      Object.defineProperty(this.state, key, {
        // Getter
        get: () => state[key],
        // Setter
        set: val => {
          state[key] = val;
          // 呼び出すコールバックがある場合！
          if (Array.isArray(this.observers[key])) {
            this.observers[key].forEach(observer => observer(val));
          }
        },
      });
    }
  }
  // ステータス変更購読！
  subscribe(key, cb) {
    Array.isArray(this.observers[key]) // 登録済みコールバックがあるか確認！
      ? this.observers[key].push(cb) // あれば新しいコールバック押し込み！
      : (this.observers[key] = [cb]); // なければコールバック配列で割り当て！
  }
}
```

## 4. スケルトンスクリーンと高解像度映画ポスター

**/routes/Movie.js**

```js
this.el.classList.add('container', 'the-movie');
// スケルトンスクリーン 出力!
this.el.innerHTML = /* html */ `
      <div class="poster skeleton"></div>
      <div class="specs">
        <div class="title skeleton"></div>
        <div class="labels skeleton"></div>
        <div class="plot skeleton"></div>
      </div>
    `;
// 映画の詳細情報を取得！
await getMovieDetails(history.state.id);
const { movie } = movieStore.state;
const bigPoster = movie.Poster.replace('SX300', 'SX700');
```

</details>

## ⚠️Troubleshooting

<details>
  <summary>1. OPEN APIを要請する時、500 Internal Server Error イシュー</summary>
  
  ### 🤔 Issue  
  - **Client**からOPEN API要請を送ったが、`500 Internal Server Error`が発生。
  ![Issue](/src/images/module_issue.png)
  ### ✅ Solution
  - ESモジュールをロードするには、`package.json`から `type': "module"`を設定。
</details>
<details>
  <summary>2. MovieListMore Buttonが消えるイシュー</summary>
  
  ### 🤔 Issue  
  - 映画を検索した後、他のページに移動すると`MovieListMoreコンポーネントのボタン`が消えるイシュー
  ### ✅ Solution
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
  - `render関数`の中で実行せず、ストアから一回だけ実行したのが問題`
  - ページが移動した時にストアから状態を取得できるように、reder関数でも実行されるように処置

</details>
