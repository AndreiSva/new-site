import { pageRouter } from "../router";
import { TemplatePage } from "../pages/template";

pageRouter.addRoute("/404.html", new TemplatePage("404"));
