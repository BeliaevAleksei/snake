"use strict";

import VDOM from "./vdom";
import Menu from "./menu";
import Game from "./game";
import { APPSTATE } from "./gameState";

class SnakeGame {
  constructor() {
    this.state = APPSTATE.MENU;
    this.app = document.getElementById("root");
    this.views = {
      [APPSTATE.MENU]: new Menu(this.app, this),
      [APPSTATE.GAME]: new Game(11, 11, this.app, this),
    };
    this.onStateChanged(APPSTATE.MENU);
  }

  onStateChanged(appState) {
    this.state = appState;
    this.renderViewByState();
  }

  renderViewByState() {
    const view = this.views[this.state].createVApp();
    this.app = VDOM.patch(view, this.app);
    if (this.state === APPSTATE.GAME) {
      this.views[APPSTATE.GAME].startGame(this.app)
    }
    console.log('main', this.app)
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
