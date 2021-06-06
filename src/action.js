import { action as act } from "@storybook/addon-actions";

//https://github.com/storybookjs/storybook/issues/6471

/* Partial event logging, as full logging can be expensive/slow
 * Invocation: partialLog('actionName')(eventObj, ...args)
 */
export const action = (actionName) => {
  const beacon = act(actionName);
  return (eventObj, ...args) => {
    beacon({ ...eventObj, view: undefined }, ...args);
  };
};
