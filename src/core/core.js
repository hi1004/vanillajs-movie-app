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

//// Router(페이지 렌더링) ////
const routeRender = routes => {
  // 접속할 때 해시 모드가 아니면(해시가 없으면) /#/로 리다이렉트!
  if (!location.hash) history.replaceState(null, '', '/#/'); // (상태, 제목, 주소)

  const routerView = document.querySelector('router-view');
  const [hash, queryString = ''] = decodeURI(location.href).split('?'); // 물음표를 기준으로 해시 정보와 쿼리스트링을 구분

  // 1) 쿼리스트링을 객체로 변환해 히스토리의 상태에 저장!
  const query = queryString.split('&').reduce((acc, cur) => {
    const [key, value] = cur.split('=');
    acc[key] = value;
    return acc;
  }, {});
  history.replaceState(query, '');

  // 2) 현재 라우트 정보를 찾아서 렌더링!
  const currentRoute = routes.find(route =>
    new RegExp(`${route.path}/?$`).test(hash)
  );
  routerView.innerHtml = '';
  routerView.append(new currentRoute.component().el);

  // 3) 화면 출력 후 스크롤 위치 복구!
  window.scrollTo(0, 0);
};

export function createRouter(routes) {
  // 원하는(필요한) 곳에서 호출할 수 있도록 함수 데이터를 반환!
  return () => {
    window.addEventListener('popstate', () => {
      routeRender(routes);
    });
    routeRender(routes);
  };
}
