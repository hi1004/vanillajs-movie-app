import { Component } from '../core/core';

export default class TheHeader extends Component {
  constructor() {
    super({
      tagName: 'header',
      state: {
        menus: [
          {
            name: 'Search',
            href: '#/',
            isValid: true,
          },
          {
            name: 'Movie',
            href: '#/movie',
            isValid: false,
          },
          {
            name: 'About',
            href: '#/about',
            isValid: true,
          },
        ],
        logoURL:
          'https://github.com/hi1004/United-IT-Promotion/blob/master/src/assets/executives/executives5.gif?raw=true',
      },
    });
    window.addEventListener('popstate', () => {
      const href = this.state.menus[1].href.split('?')[0];
      const hash = location.hash.split('?')[0];
      const isValid = href === hash;
      if (isValid) this.state.menus[1].isValid = true;

      this.render();
    });
  }
  render() {
    this.el.innerHTML = /* html */ `
      <a href="#/" class="logo"><span>OMDbAPI</span>.COM</a>
      <nav>
        <ul>
          ${this.state.menus
            .filter(menu => menu.isValid)
            .map(menu => {
              const href = menu.href.split('?')[0];
              const hash = location.hash.split('?')[0];
              const isActive = href === hash;
              return /* html */ `
              <li>
                <a href="${menu.href}" class="${isActive ? 'active' : ''}">
                  ${menu.name}
                </a>
              </li>
            `;
            })
            .join('')}
            
        </ul>
      </nav>
      <a href="#/about" class="user">
        <img src="${this.state.logoURL}" alt="User" />
      </a>
    `;
  }
}
