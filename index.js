/*
 * Import stylesheets.
 */
import "./style.css";

var counter = 0;
const expensiveFunction = () => {
  console.log("Perform expensive operations.", counter++);
};

function throttle_underscore(func, wait, options) {
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

/**
 * Function to implement the concept of Throttling in a
 * bit "advanced" manner.
 *
 * @param callback: The function one wants to
 * throttle / control at a specified rate.
 * @param delay: Time period specifying delay between
 * executions of the callback.
 */
const throttle_advanced = (callback, delay) => {
  /*
   * Create a closure around these variables.
   * They will be shared among all events handled by
   * the throttle.
   *
   * The variable used to indicate a running throttle
   * created by setTimeout.
   */
  let throttleTimeout = null;
  let storedEvent = null;
  /*
   * This is the function that will handle events and
   * throttle callbacks when the throttle is active.
   */
  const throttledEventHandler = event => {
    /*
     * Variable containing event to handle with the
     * throttled "callback".
     * Update the stored event on every iteration.
     */
    storedEvent = event;
    /*
     * Check for the throttle (i.e. throttleTimeout).
     * If it is not active, immediately handle the
     * event with "callback" function.
     */
    const shouldHandleEvent = !throttleTimeout;
    /*
     * If throttle (i.e. throttleTimeout) is not active,
     * execute the "callback" and create a new throttle .
     */
    if (shouldHandleEvent) {
      /*
       * Handle event by executing "callback" with the
       * most recent event stored (using storedEvent).
       */
      callback(storedEvent);
      /*
       * Since, the most recent event stored is handled,
       * "null" it out.
       */
      storedEvent = null;
      /*
       * Create a new throttle by setting a timeout to
       * prevent handling events during the delay.
       * Once the timeout finishes, we execute our
       * throttle if we have a stored event.
       */
      throttleTimeout = setTimeout(() => {
        /*
         * We immediately null out the throttleTimeout
         * since the throttle time has expired.
         */
        throttleTimeout = null;
        /*
         * If we have a stored event, recursively call this function.
         * The recursion is what allows us to run continusously
         * while events are present.
         * If events stop coming in, our throttle will end.
         * It will then execute immediately if a new event ever comes.
         */
        if (storedEvent) {
          /*
           * Since our timeout finishes:
           * 1. This recursive call will execute "callback"
           * immediately since throttleTimeout is now null.
           * 2. It will restart the throttle timer, allowing
           * us to repeat the throttle process.
           */
          throttledEventHandler(storedEvent);
        }
      }, delay);
    }
  };
  /*
   * Return our throttled event handler as a closure.
   */
  return throttledEventHandler;
};

/**
 * Function to implement the concept of Throttling in a
 * "basic" manner.
 *
 * @param callback: Callback function that one wants
 * to throttle.
 * @param delay: Time period specifying delay between
 * throttled events.
 */
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
