import { TemplatePage } from "../pages/template";
import { pageRouter } from "../router";

const page = new TemplatePage("index");

pageRouter.addRoute("/", page);
pageRouter.addRoute("/home", page);
