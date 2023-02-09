//// Component ////
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
  public el;
  public props;
  public state;
  constructor(payload: ComponentPayload = {}) {
    const { tagName = 'div', state = {}, props = {} } = payload;
    this.el = document.createElement(tagName);
    this.state = state;
    this.props = props;
    this.render();
  }
  render() {
    // ...
  }
}

//// Router(페이지 렌더링) ////
interface Route {
  path: string;
  component: typeof Component;
}
type Routes = Route[];

const routeRender = (routes: Routes) => {
  // 접속할 때 해시 모드가 아니면(해시가 없으면) /#/로 리다이렉트!
  if (!location.hash) history.replaceState(null, '', '/#/'); // (상태, 제목, 주소)

  const routerView = document.querySelector('router-view');
  const [hash, queryString = ''] = decodeURI(location.hash).split('?'); // 물음표를 기준으로 해시 정보와 쿼리스트링을 구분

  interface Query {
    [key: string]: string;
  }
  // 1) 쿼리스트링을 객체로 변환해 히스토리의 상태에 저장!
  const query = queryString.split('&').reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {} as Query); // 타입 단언
  history.replaceState(query, ''); // (상태, 제목)

  // 2) 현재 라우트 정보를 찾아서 렌더링!
  const currentRoute = routes.find(route =>
    new RegExp(`${route.path}/?$`).test(hash)
  );

  if (routerView) {
    // 타입 가드
    routerView.innerHTML = '';
    currentRoute && routerView.append(new currentRoute.component().el);
  }

  // 3) 화면 출력 후 스크롤 위치 복구!
  window.scrollTo(0, 0);
};

export function createRouter(routes: Routes) {
  // 원하는(필요한) 곳에서 호출할 수 있도록 함수 데이터를 반환!
  return () => {
    window.addEventListener('popstate', () => {
      routeRender(routes);
    });
    routeRender(routes);
  };
}

//// Store ////
interface StoreObservers {
  [key: string]: SubscribeCallback[];
}
interface SubscribeCallback {
  (arg: unknown): void;
}
export class Store<S> {
  public state = {} as S; // 상태(데이터)
  private observers = {} as StoreObservers;
  constructor(state: S) {
    for (const key in state) {
      // 각 상태에 대한 변경 감시(Setter) 설정!
      Object.defineProperty(this.state, key, {
        // Getter
        get: () => state[key],
        // Setter
        set: val => {
          state[key] = val;
          // 호출할 콜백이 있는 경우!
          if (Array.isArray(this.observers[key])) {
            this.observers[key].forEach(observer => observer(val));
          }
        },
      });
    }
  }
  // 상태 변경 구독
  subscribe(key: string, cb: SubscribeCallback) {
    Array.isArray(this.observers[key]) // 이미 등록된 콜백이 있는지 확인!
      ? this.observers[key].push(cb) // 있으면 새로운 콜백 밀어넣기!
      : (this.observers[key] = [cb]); // 없으면 콜백 배열로 할당!
  }
}
