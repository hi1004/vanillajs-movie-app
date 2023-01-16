import { Component } from './core/core';
export default class App extends Component {
  render() {
    this.el.id = 'app';
    const routerView = document.createElement('router-view');
    this.el.append(routerView);
  }
}
