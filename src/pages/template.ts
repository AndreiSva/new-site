import { Page, loadTemplate } from "../router";

import "../components/navigationbar";

export class TemplatePage extends Page {
#templateName: string;
  constructor(templateName: string) {
    super();
    this.#templateName = templateName;
  }

  async buildPage() {
    const elements = await loadTemplate(this.#templateName);
    this.addElements(...elements);
  }
}
