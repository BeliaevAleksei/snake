import VDOM from "./vdom";

export default class MenuState {
  constructor() {
    this.state = {
      selectedRow: 0,
      rows: ["Start", "Options"],
    };
  }

  onStateChanged() {
    VDOM.patch(this.createVApp(store), app);
  }

  createVApp() {
    const { selectedRow, rows } = this.state;
    const htmlMenuRows = rows.map((item, index) => {
      const className =
        index === selectedRow ? "menu__item menu__item_selected" : "menu__item";
      return VDOM.createVNode(
        "p",
        {
          class: className,
          onclick: (event) => {
            console.log("EVENT: ", event);
            switch (event.key) {
              case "ArrowUp": {
                this.setState("changeSelectedRow", index);
                break;
              }
              case "ArrowDown": {
                this.setState("changeSelectedRow", index);
                break;
              }
              default:
                break;
            }
          },
        },
        [item]
      );
    });
    return VDOM.createVNode("div", { class: "menu" }, htmlMenuRows);
  }

  setState(action, value) {
    if (action === "changeSelectedRow") {
      this.state.selectedRow = value
      // if (value === "ArrowUp") {
      //   const newState = this.state.selectedRow - 1;
      //   if (newState < 0) {
      //     this.state.selectedRow = this.state.rows.length - 1;
      //   }
      // }
      // if (value === "ArrowDown") {
      //   const newState = this.state.selectedRow + 1;
      //   if (newState > this.state.rows.length - 1) {
      //     this.state.selectedRow = 0;
      //   }
      // }
      this.onStateChanged();
    }
  }

  // setHandler() {
  //   document.addEventListener("keydown", (event) => {
  //     switch (event.key) {
  //       case "ArrowUp": {
  //         this.setState("changeSelectedRow", "ArrowUp");
  //         break;
  //       }
  //       case "ArrowDown": {
  //         this.setState("changeSelectedRow", "ArrowDown");
  //         break;
  //       }
  //       default:
  //         break;
  //     }
  //   });
  // }
  // removeHandler() {
  //   document.removeEventListener("keydown");
  // }
}
