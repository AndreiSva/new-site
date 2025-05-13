
export async function loadTemplate(path: string) {
  const m = await import(`./templates/${path}.html?raw`);
  const htmlText: string = m.default;
  let holder = document.createElement("template");
  holder.innerHTML = htmlText.trim();
  return Array.from(holder.content.children);
}

export class Page {
#elements: Element[] = [];
#displayCallbacks: (() => void) [] = [];
  async display() {
    console.log(`displaying page...`)

    this.#elements = [];
    await this.buildPage();
    const appDiv = document.querySelector<HTMLDivElement>("#app")!;

    appDiv.replaceChildren(...this.#elements);
    this.#displayCallbacks.forEach((cb) => {
      cb();
    })
  }

  async buildPage() {

  }

  addDisplayCallback(cb: () => void) {
    console.log(this.#displayCallbacks);
    this.#displayCallbacks.unshift(cb);
  }

  addElements(...items: Element[]) {
    this.#elements.push(...items);
  }
}

class Router {
#routes: Map<string, Page>;
  constructor() {
    this.#routes = new Map<string, Page>();
  }

  initEventListener() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) {
        e.preventDefault();
        const link = target.getAttribute("href")!;
        this.route(link);
      }
    });

    window.addEventListener("popstate", () => {
      this.route(window.location.pathname);
    });
  }

  route(link: string) {
    console.log(`routing... ${link}`);
    if (link.length != 0 && !link.startsWith("/")) {
      window.location.href = link;
    }

    let page: Page;
    if (this.#routes.has(link)) {
      page = this.#routes.get(link)!;
    } else {
      const LINK_404 = "/404.html";
      page = this.#routes.get(LINK_404)!;
    }

    page.display();
    if (window.location.pathname != link) {
      window.history.pushState({}, "", link);
    }
  }

  addRoute(link: string, page: Page) {
    this.#routes.set(link, page);
  }
}

export const pageRouter = new Router();
