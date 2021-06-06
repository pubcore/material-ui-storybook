import React, { useEffect, useState } from "react";
import { Card as MuiCard } from "@material-ui/core";
import styled from "styled-components";
import Login from "../../Login";
import Help from "../../Help";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { useConfig } from "../../../store";

export default function LoginPage({ login, withBg }) {
  const [bgImage, setBgImage] = useState(null);
  const bgImageUri = useConfig("landing_background");
  const logoUri = useConfig("logo");

  useEffect(() => {
    var mounted = true;
    const lazyLoadBackgroundImage = () => {
      if (!bgImage) {
        const img = new Image();
        img.onload = () => mounted && setBgImage(bgImageUri);
        img.src = bgImageUri;
      }
    };
    withBg && lazyLoadBackgroundImage();
    return () => (mounted = false);
  }, [bgImage, withBg]);

  return (
    <Layout {...{ bgImage }}>
      <Card>
        <Header>
          <img src={logoUri} width={200} />
        </Header>
        <Login {...{ login }} />
      </Card>
      <HelpWrapper {...{ bgImage }}>
        <Help />
      </HelpWrapper>
    </Layout>
  );
}

const Layout = styled.div`
  ${({ theme: { palette, spacing }, bgImage }) => `
  display: flex;
  flex-direction: column;
  gap: ${spacing(1)}px;
  min-height: 100vh;
  align-items: center;
  justify-content: flex-start;
  background-repeat: no-repeat;
  background-size: cover;
  background-image:
  ${
    bgImage
      ? `url(${bgImage});`
      : `radial-gradient(
    circle at 50% 14em,
    ${palette.secondary.light} 0%,
    ${palette.secondary.dark} 80%,
    ${palette.secondary.dark} 100%
  );`
  }`}
`;

const Card = styled(MuiCard)`
  min-width: 300px;
  margin-top: 5em;
`;
const Header = styled.div`
  margin: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HelpWrapper = styled.div`
  ${({ theme: { palette, spacing }, bgImage }) =>
    bgImage
      ? `
  background-color: ${fade(palette.background.default, 0.8)};
  padding: ${spacing(0.5)}px;
`
      : ``}
`;
