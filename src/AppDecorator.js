import React from "react";
import { StylesProvider } from "@material-ui/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";

export { registerConfig, registerSelector } from "./store";

export const AppDecorator = ({
  createTheme,
  useDarkMode = () => null,
  children,
}) => {
  var darkModeBySwitch = useDarkMode(),
    darkModeByMediaQuery = useMediaQuery("(prefers-color-scheme: dark)"),
    darkMode = darkModeBySwitch ?? darkModeByMediaQuery,
    theme = React.useMemo(() => createTheme({ darkMode }), [darkMode]);

  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider {...{ theme }}>
        <ThemeProvider {...{ theme }}>
          <CssBaseline />
          <BrowserRouter>
            <React.StrictMode>{children}</React.StrictMode>
          </BrowserRouter>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};
