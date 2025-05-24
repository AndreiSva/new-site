import { marked } from "marked";

import { Page, loadTemplate } from "../router";
import "../components/navigationbar";

export class BlogLandingPage extends Page {
  constructor() {
    super();
  }

  async buildPage() {
    const elements = await loadTemplate("blog");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.getAttribute("id") == "blogArticleList") {
        const articleList = element;
        const m = import.meta.glob("../blog/*.md", { as: "raw" });
        console.log(m);
        Object.keys(m).forEach((blogPath) => {
          (m[blogPath]()).then((postContent) => {
            const blogTitle = blogPath.split("/").at(-1)!.split(".").at(0);

            // TODO: Replace this with a component
            const articleCard = document.createElement("div");
            articleCard.classList.add("card");

            const articleBody = document.createElement("p");
            articleBody.innerHTML = blogTitle!.toString();

            articleCard.appendChild(articleBody);
            articleList.appendChild(articleCard);
          });
        });
      }
    }
    this.addElements(...elements);
  }
}
