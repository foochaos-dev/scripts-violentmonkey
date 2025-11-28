export function spyOn(obj, key, callback) {
  // Define the handler for intercepting the set operation on selectedUserid
  const handler = {
    set(target, prop, value) {
      // If the `key` changed, trigger the callback
      if (prop === key && target[prop] !== value) {
        callback(value);
      }

      // Proceed with the default behavior of setting the property
      target[prop] = value;
      return true;
    }
  };

  // Create a proxy to observe the changes
  return new Proxy(obj, handler);
}
