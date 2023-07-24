"use strict";

import VDOM from "./vdom";
import Menu from "./menu";
import { startGame } from "./game";
import { APPSTATE } from "./gameState";

class SnakeGame {
  constructor() {
    this.state = APPSTATE.MENU;
    this.app = document.getElementById("root");
    this.views = {
      [APPSTATE.MENU]: new Menu(this.app, this),
      [APPSTATE.GAME]: new 
    };
    const view = this[this.state].createVApp();
    this.app = VDOM.patch(view, this.app);
  }

  onStateChanged() {
    this[this.state].createVApp();
    VDOM.patch(createVApp(this.store), app);
  }

  renderViewByState(appState) {
    delete this.state;
    this.state = nextState;
    this[this.state] = new Menu(this.app, this);
    this.onStateChanged();
  }

  trigerGlobalEvent(event) {
    this[this.state].trigerGlobalEvent(event);
  }
}

const game = new SnakeGame();
window.addEventListener("onkeydown", (event) => {
  console.log("onkeydown global", event);
  game.trigerGlobalEvent(event);
});
