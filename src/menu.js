import VDOM from "./vdom";
import { APPSTATE } from "./index";

export default class MenuState {
  constructor(app, snakeGame) {
    this.app = app;
    this.state = {
      rows: ["Start", "Options"],
    };
    this.startGame = () => snakeGame.setState(APPSTATE.GAME);
  }

  onStateChanged() {
    VDOM.patch(this.createVApp(this.store), this.app);
  }

  trigerGlobalEvent(event) {
    
  }

  createVApp() {
    const htmlMenuRows = [
      VDOM.createVButton("Start", {
        class: className,
        onclick: () => this.startGame(),
      }),
      VDOM.createVButton("Options", {
        class: className,
        onclick: () => {
          console.log("Options click");
        },
      }),
    ];
    return VDOM.createVNode(
      "div",
      {
        class: "menu",
        onkeydown: (event) => {
          console.log("KEYDOWN", event);
        },
      },
      htmlMenuRows
    );
  }

  setState(action, value) {
    if (action === "changeSelectedRow") {
      this.state.selectedRow = value;
      if (value === "ArrowUp") {
        const newState = this.state.selectedRow - 1;
        if (newState < 0) {
          this.state.selectedRow = this.state.rows.length - 1;
        }
      }
      if (value === "ArrowDown") {
        const newState = this.state.selectedRow + 1;
        if (newState > this.state.rows.length - 1) {
          this.state.selectedRow = 0;
        }
      }
      this.onStateChanged();
    }
  }
}
