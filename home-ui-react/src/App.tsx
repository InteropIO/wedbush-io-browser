import { useMemo } from "react";
import { IOConnectHome, IOConnectHomeConfig } from "@interopio/home-ui-react";
import { getIOConfig } from "./helpers";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";
import "@interopio/home-ui-react/index.css";

export function App() {
  const ioConnectHomeConfig: IOConnectHomeConfig = useMemo(
    () => ({
      getIOConnectConfig: getIOConfig,
      login: {
        type: "simple",
        onLogin: async (username, password) => {
            // Custom validation logic.
            // await validateUser(username, password);

            const user = { id: username, username, password };

            return user;
        }
      }
    }),
    []
  );

  return <IOConnectHome config={ioConnectHomeConfig} />;
}

export default App;
