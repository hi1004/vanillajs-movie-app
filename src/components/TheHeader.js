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
          },
          {
            name: 'Movie',
            href: '#/movie',
          },
          {
            name: 'About',
            href: '#/about',
          },
        ],
        logoURL:
          'https://github.com/hi1004/United-IT-Promotion/blob/master/src/assets/executives/executives5.gif?raw=true',
      },
    });
  }
  render() {
    this.el.innerHTML = /* html */ `
      <a href="#/" class="logo"><span>OMDbAPI</span>.COM</a>
      <nav>
        <ul>
          ${this.state.menus
            .map(menu => {
              return /* html */ `
              <li>
                <a href="${menu.href}">
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
