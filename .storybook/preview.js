import { addDecorator } from "@storybook/react";
import { AppDecorator, registerConfig } from "../src/components";
import { useDarkMode } from "storybook-dark-mode";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import "@fontsource/fira-sans";

registerConfig({
  logo: "/img/logo.png",
  landing_background: "/img/landing-background.jpg",
  general_help_uri: "https://www.wikipedia.com",
});

(async () =>
  await i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: { name: "Name" },
      },
    },
    fallbackLng: "en",
    debug: false,
    lng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    parseMissingKeyHandler: (key) =>
      (key[0].toUpperCase() + key.slice(1)).replace(/_/, " "),
    react: {
      bindI18n: false,
      transSupportBasicHtmlNodes: false,
      useSuspense: false,
    },
  }))();

addDecorator(function decorator(Story) {
  return (
    <AppDecorator {...{ useDarkMode, createTheme }}>
      <Story />
    </AppDecorator>
  );
});

export const parameters = { layout: "fullscreen" };

const createTheme = ({ darkMode }) =>
  responsiveFontSizes(
    createMuiTheme({
      typography: {
        useNextVariants: true,
        fontFamily: ['"Fira Sans"', "Helvetica", "Arial", "sans-serif"],
      },
      palette: {
        type: darkMode ? "dark" : "light",
        primary: {
          main: darkMode ? "#007705" : "#2e7d32",
        },
        secondary: {
          main: darkMode ? "#5d99c6" : "#90caf9",
        },
      },
      props: {
        MuiButton: {
          variant: "contained",
        },
        MuiTextField: {
          variant: "outlined",
        },
      },
    })
  );
