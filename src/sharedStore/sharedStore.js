export default class SharedStoreRoot {
  static instance = new SharedStoreRoot();

  constructor() {
    window.store = SharedStoreRoot.instance;
    return SharedStoreRoot.instance;
  }

  state = {};
  store = {};

  registerStore = (key, state) => {
    const oldState = this.state[key];
    this.state[key] = { ...oldState, ...state };
    const store = new Store(this.state[key], key);
    this.store[key] = store;
  };

  getStore = key => {
    return this.store[key];
  };
}

class Store {
  subscribers = [];
  constructor(state, key) {
    this.state = state;
    this.key = key;
  }

  get(prop) {
    return this.state[prop];
  }

  subscribe(prop, callback) {
    const callbackRef = new window.WeakRef(callback);
    this.subscribers[prop] = this.subscribers[prop] || [];
    this.subscribers[prop].push(callbackRef);
  }

  set(prop, value) {
    const oldValue = this.state[prop];
    this.state[prop] = value;
    this.notify(prop, value, oldValue);
  }

  notify(prop, value, oldValue) {
    const subscribes = this.subscribers[prop] || [];
    subscribes.forEach(callback => {
      callback.deref()(value, oldValue);
    });
  }

  notifyAll() {
    for (const prop in this.state) {
      this.notify(prop, this.state[prop]);
    }
  }
}

export function useSharedStore(key, state) {
  const sharedStore = new SharedStoreRoot();
  const hasStore = sharedStore.state[key] ? true : false;

  if (!hasStore) {
    sharedStore.registerStore(key, state || {});
  }

  return sharedStore.getStore(key);
}
