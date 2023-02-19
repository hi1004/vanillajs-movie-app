# 🎦Movie App (TypeScript ver.)

OMDB API を活用した VanillaJs 映画検索アプリケーションです。<br>
このプロジェクトは[JS バージョン](https://github.com/hi1004/vanillajs-movie-app/tree/js-only)と[TS バージョン](https://github.com/hi1004/vanillajs-movie-app/tree/main)で分けられています。<br>
基本バージョンは TS です。

[DEMO - OMDBAPI THE OPEN MOVIE APP](https://ts-movie-app-umber.vercel.app/#/)
![Screenshot](/src/images/screenshot_domo.png)
![gif](/src/images/demo.gif)

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

TypeScript コアパッケージと `node-fetch` のタイピングパッケージをインストールします。

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
  public el; // コンポーネントの最上位要素
  public props; // コンポーネントが使用される時に親コンポーネントから受信するデータ
  public state; // コンポーネント内で使用するデータ
  constructor(payload: ComponentPayload = {}) {
    const {
      tagName = 'div', // 最上位要素のタグ名
      props = {},
      state = {},
    } = payload;
    this.el = document.createElement(tagName);
    this.props = props;
    this.state = state;
    this.render();
  }
  render() {
    // コンポーネントをレンダリングする関数
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

// ページレンダリング!
function routeRender(routes: Routes) {
  // 接続する時、ハッシュモードでなければ（ハッシュがなければ）/#/にリダイレクト！
  if (!location.hash) {
    history.replaceState(null, '', '/#/'); // （状態、タイトル、住所）
  }
  const routerView = document.querySelector('router-view');
  const [hash, queryString = ''] = location.hash.split('?'); // はてなマークに基づいてハッシュ情報とクエリストリングを区分

  // 1) クエリーストリングをオブジェクトに変換してヒストリーの状態に保存！
  interface Query {
    [key: string]: string;
  }
  const query = queryString.split('&').reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {} as Query);
  history.replaceState(query, ''); //（状態、タイトル)

  // 2) 現在のrouter情報を見つけてレンダリング!
  const currentRoute = routes.find(route =>
    new RegExp(`${route.path}/?$`).test(hash)
  );
  if (routerView) {
    routerView.innerHTML = '';
    currentRoute && routerView.append(new currentRoute.component().el);
  }

  // 3) 画面出力後、スクロール位置復旧！
  window.scrollTo(0, 0);
}
export function createRouter(routes: Routes) {
  // 好きなところから呼び出せるように関数データを返却！
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
  public state = {} as S; // 状態(データ)
  private observers = {} as StoreObservers; // ステータス変更検出により実行するコールバック
  constructor(state: S) {
    for (const key in state) {
      // 各状態に対する変更監視(Setter)設定！
      Object.defineProperty(this.state, key, {
        // Getter
        get: () => state[key],
        // Setter
        set: val => {
          state[key] = val;
          if (Array.isArray(this.observers[key])) {
            // 呼び出すコールバックがある場合！
            this.observers[key].forEach(observer => observer(val));
          }
        },
      });
    }
  }
  // ステータス変更購読！
  subscribe(key: string, cb: SubscribeCallback) {
    Array.isArray(this.observers[key]) // 登録済みコールバックがあるか確認！
      ? this.observers[key].push(cb) // あれば新しいコールバック押し込み！
      : (this.observers[key] = [cb]); // なければコールバック配列で割り当て！
  }
}
```

## 4. スケルトンスクリーンと高解像度映画ポスター

**/routes/Movie.ts**

```ts
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
  - ESモジュールのバージョンが違い、プロジェクトで適用されなかったバージョンイシューが発生。
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
