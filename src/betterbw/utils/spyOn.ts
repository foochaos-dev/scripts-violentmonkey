export type Watchers<T extends object> = {
  [K in keyof T]?: (value: T[K]) => void;
};

/**
 * You always attach the spy on the parent.
 * Example:
 *
 *         window.myObj = { myProp: 5 };
 *         window.myObj = spyOn(
 *           window.myObj, {
 *           myProp: (val) => console.log('myProp ->', val)
 *         }).proxy;
 *         window.myObj.myProp = 42; // prints on console "myProp -> 42"
 *
 * or:
 *
 *         window.myObj = { myProp: 5 };
 *         const { proxy, revoke } = spyOn(
 *           window.myObj, {
 *           myProp: (val) => console.log('myProp ->', val)
 *         });
 *         window.myObj = proxy;
 *         window.myObj.myProp = 42; // prints on console "myProp -> 42"
 *         // (later...)
 *         revoke();
 *         window.myObj.myProp = 42; // doesn't print anything on console
 *
 */
export function spyOn<T extends object>(obj: T, watchers: Watchers<T>) {
  return Proxy.revocable<T>(obj, {
    set(target, prop, value) {
      // If the watched value changed, trigger the callback
      if (prop in watchers && target[prop] !== value) {
        watchers[prop](value);
      }

      // Proceed with the default behavior of setting the property
      target[prop] = value;
      return true;
    },
  });
}
