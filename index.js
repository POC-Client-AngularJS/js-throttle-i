// Import stylesheets
import "./style.css";

var counter = 0;
const expensiveFunction = () => {
  console.log("Perform expensive operations.", counter++);
};

const throttle1 = (func, wait) => {
  let flag = true;
  return () => {
    let context = this,
      args = arguments;
    if (flag) {
      func.apply(context, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, wait);
    }
  };
};

function throttle2(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

// Pass in the callback that we want to throttle and the delay between throttled events
const throttle = (callback, delay) => {
  // Create a closure around these variables.
  // They will be shared among all events handled by the throttle.
  let throttleTimeout = null;
  let storedEvent = null;

  // This is the function that will handle events and throttle callbacks when the throttle is active.
  const throttledEventHandler = event => {
    // Update the stored event every iteration
    storedEvent = event;

    // We execute the callback with our event if our throttle is not active
    const shouldHandleEvent = !throttleTimeout;

    // If there isn't a throttle active, we execute the callback and create a new throttle.
    if (shouldHandleEvent) {
      // Handle our event
      callback(storedEvent);

      // Since we have used our stored event, we null it out.
      storedEvent = null;

      // Create a new throttle by setting a timeout to prevent handling events during the delay.
      // Once the timeout finishes, we execute our throttle if we have a stored event.
      throttleTimeout = setTimeout(() => {
        // We immediately null out the throttleTimeout since the throttle time has expired.
        throttleTimeout = null;

        // If we have a stored event, recursively call this function.
        // The recursion is what allows us to run continusously while events are present.
        // If events stop coming in, our throttle will end. It will then execute immediately if a new event ever comes.
        if (storedEvent) {
          // Since our timeout finishes:
          // 1. This recursive call will execute `callback` immediately since throttleTimeout is now null
          // 2. It will restart the throttle timer, allowing us to repeat the throttle process
          throttledEventHandler(storedEvent);
        }
      }, delay);
    }
  };

  // Return our throttled event handler as a closure
  return throttledEventHandler;
};

const betterFunction = throttle(expensiveFunction, 100);

var eleDivWithScroll = document.getElementById("idDivWithScroll");
if (window.attachEvent) {
  window.attachEvent("scroll", betterFunction);
} else {
  window.addEventListener("scroll", betterFunction);
}
