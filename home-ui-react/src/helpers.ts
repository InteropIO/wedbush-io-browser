import IOBrowserPlatform, { IOConnectBrowserPlatform } from '@interopio/browser-platform';
import IOWorkspaces from '@interopio/workspaces-api';
import { IOConnectInitSettings } from '@interopio/react-hooks';
import config from './config.json'

export const getIOConfig = (): IOConnectInitSettings => {
  return {
    browserPlatform: {
      factory: IOBrowserPlatform,
      config: Object.assign({} as any, config.browserPlatform,
        {
          browser: { libraries: [IOWorkspaces] },
          serviceWorker: { url: "/service-worker.js" },
          licenseKey: process.env.REACT_APP_IOCONNECT_BROWSER_LICENSE as string
        }
      ) as IOConnectBrowserPlatform.Config
    },
  };
};
