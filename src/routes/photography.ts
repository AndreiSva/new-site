import { TemplatePage } from "../pages/template";
import { pageRouter } from "../router";

pageRouter.addRoute("/photography", new TemplatePage("comingsoon"));
