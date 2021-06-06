"use strict";
require("dotenv").config();
const { spawn } = require("child_process");
const { HTTPS, SSL_CA, SSL_CERT, SSL_KEY } = process.env;
const sslConfig =
  HTTPS === "true"
    ? [
        "--https",
        "--ssl-ca",
        SSL_CA,
        "--ssl-cert",
        SSL_CERT,
        "--ssl-key",
        SSL_KEY,
      ]
    : [];
spawn("npx", ["start-storybook", ...sslConfig, "-s", "./public"], {
  stdio: "inherit",
});
