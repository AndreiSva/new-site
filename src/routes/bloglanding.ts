import { TemplatePage } from "../pages/template";
import { pageRouter } from "../router";

pageRouter.addRoute("/blog", new TemplatePage("comingsoon"));
