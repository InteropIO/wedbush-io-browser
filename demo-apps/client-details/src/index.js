import React from "react";
import { createRoot } from "react-dom/client";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOBrowser from "@interopio/browser";
import IOWorkspaces from "@interopio/workspaces-api";
import "bootstrap/dist/css/bootstrap.css";

import "./index.css";
import ClientDetails from "./ClientDetails";

const root = createRoot(document.getElementById("root"));
root.render(
  <IOConnectProvider
    settings={{
      browser: {
        config: { libraries: [IOWorkspaces] },
        factory: IOBrowser,
      },
    }}
  >
    <ClientDetails />
  </IOConnectProvider>
);
