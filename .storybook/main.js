module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "storybook-dark-mode",
    {
      name: "@storybook/addon-essentials",
      options: {
        backgrounds: false,
        controls: false,
      },
    },
  ],
};
