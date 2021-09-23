import angular from "angular";
import TasyModule from "./index.module";
import tasy from "./tasy/index";

function main() {
  const appNode = document.getElementById("app");
  angular.bootstrap(appNode, ["ng", TasyModule]);

  tasy();
}

main();
