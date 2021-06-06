import styled from "styled-components";

export const Layout = styled.div`
  ${({
    theme: {
      palette: { background, getContrastText },
    },
  }) => `
  display: flex;
  flex-direction: column;
  z-index: 1;
  min-height: 100vh;
  background-color: ${background.default};
  position: relative;
  min-width: fit-content;
  width:100%;
  color: ${getContrastText(background.default)};
  `}
`;
export const AppFrame = styled.div`
  ${({ theme: { breakpoints, spacing } }) => `
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  ${breakpoints.up("xs")}{
    margin-top: ${spacing(6)}px;
  }
  ${breakpoints.down("xs")}{
    margin-top: ${spacing(7)}px;
  }
  `}
`;

export const Main = styled.main`
  display: flex;
  flex-grow: 1;
`;

export const Content = styled.div`
  ${({ theme: { spacing, breakpoints } }) => `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  flex-basis: 0;
  padding: ${spacing(2)}px;
  padding-top: ${spacing(2)}px;
  padding-left: 0;
  padding-bottom: ${spacing(1)}px;
  ${breakpoints.up("xs")}: {
    padding-left: 5px;
  }
  ${breakpoints.up("sm")}: {
    padding: 0;
  }
  `}
`;
