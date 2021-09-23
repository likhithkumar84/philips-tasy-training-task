import { WEventDef } from "./wEventDef";
import { WStore } from "./wStore";
import { WEventDOMPlugin } from "./wEventDOMPlugin";
import WeakReference from "./weakReference";
import { func } from "prop-types";

export default class Component {
  constructor($scope, HandlerType) {
    const store = new WStore({}).unsubscribable();

    const internalHandler = new HandlerType(store, WEventDef);
    internalHandler.internalDestroy = $scope.$destroy.bind($scope);

    const publicHandler = internalHandler.expose();
    publicHandler.events = internalHandler.events;

    this.internalHandlerWeakRef = new WeakReference(internalHandler, true);
    this.internalHandler = this.internalHandlerWeakRef.get();

    this.publicHandlerWeakRef = new WeakReference(publicHandler, true);
    this.publicHandler = this.publicHandlerWeakRef.get();

    this.parentScope = $scope.$parent;
    this.scope = $scope;
    this.scope.handler = this.publicHandler;
    this.scope.internalHandler = this.internalHandler;
    this.store = store;
    this.scope.internalHandler = this.internalHandler;

    this.attachDestroy();
  }

  link($element, DOMHandlerType, $compile, $injector) {
    this.element = $element;
    this.element.handler = this.publicHandler;
    const self = this;
    this.element.remove = () => {
      const removeFromProto = this.element.__proto__.remove.bind(this.element);
      removeFromProto();
      debugger;
      this.internalHandler.events.onDestroy.fireDeferredEvent().then(() => {
        self.store.unsubscribe();
        debugger;
        self.internalHandlerWeakRef.revoke();
        self.publicHandlerWeakRef.revoke();
        self.domHandler.destroy();
      });
    };

    this.setupEvents();

    this.domHandler = new DOMHandlerType(
      this.element.firstElementChild,
      this.internalHandler,
      this.store,
      this.scope,
      $compile,
      $injector
    );
    this.element.dispatchEvent(
      new CustomEvent("onDidLoad", { detail: { handler: this.publicHandler } })
    ); // native alternative to w-load
  }

  setupEvents() {
    Object.keys(this.internalHandler.events).forEach(event => {
      this.internalHandler.events[event].setPlugin(
        // Need refactor: how much is safe expose internalHandler to events?
        new WEventDOMPlugin(
          this.internalHandler,
          this.element,
          event,
          this.parentScope
        )
      );
    });
  }

  attachDestroy() {
    const { internalHandlerWeakRef, publicHandlerWeakRef, store } = this;

    this.scope.$on("$destroy", () => {
      this.internalHandler.events.onDestroy.fireDeferredEvent().then(() => {
        store.unsubscribe();
        internalHandlerWeakRef.revoke();
        publicHandlerWeakRef.revoke();
        this.domHandler.destroy();
      });
    });
  }

  fireOnLoad() {
    this.internalHandler.events.onLoad.fireEventAsync();
  }
}
