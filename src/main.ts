import "./style.css";
import { initGraphics } from "./graphics";
import { pageRouter } from "./router";

document.addEventListener("DOMContentLoaded", () => {
  import.meta.glob("./routes/**/*.ts", { eager: true })
  pageRouter.initEventListener();
  pageRouter.route(window.location.pathname);
  initGraphics();
  console.log("loaded :)");
})
