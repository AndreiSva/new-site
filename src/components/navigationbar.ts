import { loadTemplate } from "../router";

class NavigationBar extends HTMLElement {
  constructor() {
    super();
    loadTemplate("navigationbar").then((elements) => {
      this.replaceChildren(...elements);
    });
  }
}

customElements.define("rm-navbar", NavigationBar);
