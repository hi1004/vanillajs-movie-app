import TheHeader from './components/TheHeader';
import TheFooter from './components/TheFooter';
import { Component } from './core/core';
export default class App extends Component {
  render() {
    this.el.id = 'app';
    const routerView = document.createElement('router-view');
    const theHeader = new TheHeader().el;
    const theFooter = new TheFooter().el;
    this.el.append(theHeader, routerView, theFooter);
  }
}
