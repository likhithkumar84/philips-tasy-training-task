import createComponent from "labs/tasyDirective";
import Handler from "./w-my-component-handler";
import DOMHandler from "./w-my-component-dom-handler";
import template from "./w-my-component";

export default createComponent(template, Handler, DOMHandler);
