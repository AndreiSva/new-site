export class Heading extends HTMLElement {
  constructor(text: string) {
    super();
    this.innerText = text;
    this.style.fontSize = "20px";
    this.classList.add("title");
  }
}

customElements.define("rm-hdng", Heading);
