import { Page, pageRouter } from "../router";

export class TestPage extends Page {
  constructor() {
    super();
  }

  async buildPage() {
    const testText = document.createElement("p");
    testText.innerText = "Wow! You found a super secret page!";
    testText.style.fontSize = "30px";
    testText.style.color = "red";
    const testLink = document.createElement("a");
    testLink.href = "/test";
    testLink.innerText = "Click me!";
    this.addElements(testText, testLink);
  }
}


pageRouter.addRoute("/test", new TestPage());
