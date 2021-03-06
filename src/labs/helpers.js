import angular from "angular";
import { within } from "@testing-library/dom";
import "angular-mocks/angular-mocks.js";

export function getHandler(element) {
  if (element.handler) {
    return Promise.resolve(element.handler);
  }

  return new Promise(resolve => {
    element.addEventListener(
      "onDidLoad",
      event => {
        debugger;
        resolve(event.detail.handler);
      },
      { once: true }
    );
  });
}

export function render(html) {
  const $injector = angular.injector(["ng", "ngMock", "tasy-framework"]);

  const $rootScope = $injector.get("$rootScope");
  const $compile = $injector.get("$compile");

  const $element = angular.element(html);
  const elementDOM = $element[0];
  const $scope = $rootScope.$new();

  $compile($element)($scope);
  $scope.$digest();

  const scope = angular.element($element[0].firstElementChild)?.scope();

  return {
    handler: scope.handler,
    container: elementDOM,
    ...within(elementDOM)
  };
}
