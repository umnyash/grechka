/* * * * * * * * * * * * * * * * * * * * * * * *
 * pub-sub.js
 */
class PubSub {
  constructor() {
    this.listeners = {};
  }

  addListener(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(fn);
  }

  removeListener(event, fn) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = this.listeners[event]
      .filter((listener) => listener !== fn);
  }

  emit(event, data) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event]
      .forEach((listener) => listener(data));
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */
