import React from "react";
import { Link } from "@material-ui/core";

//Use A for external links. Use "Link" for internal links
export default function A({ href, children, ...rest }) {
  //security: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
  const protocolWhitelist = ["https:", "http:"],
    { protocol } = new URL(href),
    protocolOk = protocolWhitelist.includes(protocol);

  return (
    <Link
      {...{ ...rest }}
      href={
        protocolOk
          ? href
          : console.error("Invalid protocol '%s'", protocol) || ""
      }
      target="_blank"
      //security: https://web.dev/external-anchors-use-rel-noopener/
      rel="noopener noreferrer"
    >
      {protocolOk && children}
    </Link>
  );
}
