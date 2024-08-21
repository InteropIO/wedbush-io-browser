import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IOConnectProvider } from "@interopio/react-hooks";
import Glue from "@glue42/desktop";
import IOBrowserPlatform, { IOConnectBrowserPlatform } from "@interopio/browser-platform";
import IOWorkspaces from "@interopio/workspaces-api";
import config from "./config.json";

console.log("🚀 ~ config:", config)

ReactDOM.render(
  <React.StrictMode>
    <IOConnectProvider settings={{
      browserPlatform: {
        config: Object.assign({}, config.browserPlatform, { browser: { libraries: [IOWorkspaces] }, serviceWorker: { url: "/service-worker.js" } }) as IOConnectBrowserPlatform.Config,
        factory: IOBrowserPlatform
      },
      desktop: {
        config: { libraries: [IOWorkspaces], appManager: "skipIcons" },
        factory: Glue
      }
    }}>
      <App />
    </IOConnectProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
