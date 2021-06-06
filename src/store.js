var useReduxSelector = (s) => s();
export const registerSelector = (selector) => (useReduxSelector = selector);
var config = {};

export const useSelector = (item) =>
  useReduxSelector((state) =>
    typeof item === "function" ? item(state) : item
  );
export const registerConfig = (conf) => (config = conf);
export const useConfig = (key) => config[key];
