import { Heading } from "./heading";

export class Card extends HTMLElement {
  constructor() {
    super();
    this.classList.add("card");
  }
}

customElements.define("rm-card", Card);
