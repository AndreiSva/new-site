import { TemplatePage } from "../pages/template";
import { pageRouter } from "../router";

pageRouter.addRoute("/contact", new TemplatePage("comingsoon"));
