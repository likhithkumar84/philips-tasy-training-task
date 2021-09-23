import angular from "angular";

import wMyComponent from "./w-my-component-directive";

export default angular
  .module("tasy-framework.components.wMyComponent", [])
  .directive("wMyComponent", wMyComponent).name;
