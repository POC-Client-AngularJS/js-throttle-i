import "./style.css";

var counter = 0;
const expensiveFunction = () => {
  console.log("Perform expensive operations.", counter++);
};

const throttle_advanced = (callback, delay) => {
  let throttleTimeout = null;
  let storedEvent = null;
  const throttledEventHandler = event => {
    storedEvent = event;
    const shouldHandleEvent = !throttleTimeout;
    if (shouldHandleEvent) {
      callback(storedEvent);
      storedEvent = null;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        if (storedEvent) {
          throttledEventHandler(storedEvent);
        }
      }, delay);
    }
  };
  return throttledEventHandler;
};

const throttle_basic = (callback, delay) => {
  let flag = true;
  return function() {
    let context = this,
      args = arguments;
    if (flag) {
      callback.apply(context, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
};

const betterFunction = throttle_basic(expensiveFunction, 100);

var eleDivWithScroll = document.getElementById("idDivWithScroll");
if (window.attachEvent) {
  window.attachEvent("scroll", betterFunction);
} else {
  window.addEventListener("scroll", betterFunction);
}