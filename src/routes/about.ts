import { TemplatePage } from "../pages/template";
import { pageRouter } from "../router";

pageRouter.addRoute("/about", new TemplatePage("comingsoon"));
