"use strict";

import VDOM from "./vdom";
import Menu from './menu';
import { startGame } from "./game";

const APPSTATE = Object.freeze({
  MENU: Symbol("MENU"),
  GAME: Symbol("GAME"),
});

class SnakeGame {
  constructor() {
    this.state = APPSTATE.MENU;
    this[APPSTATE.MENU] = new Menu()
    const menuView = this[this.state].createVApp()
    this.app = VDOM.patch(menuView, document.getElementById("root"));
  }

  onStateChanged() {
    this[this.state].createVApp()
    VDOM.patch(createVApp(this.store), app);
  }

  setState(nextState) {
    this.state = nextState;
    this.onStateChanged();
  }
}


const game = new SnakeGame()

// let app = patch(createVApp(store), document.getElementById("app"));

// store.onStateChanged = () => {
//   app = patch(createVApp(store), app);
// };

// setInterval(() => {
//     store.setState({ count: store.state.count + 1 });
// }, 1000);
