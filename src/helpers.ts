// src/helpers.ts

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
          licenseKey: import.meta.env.VITE_APP_API_IOCONNECT_BROWSER_LICENSE
        }
      ) as IOConnectBrowserPlatform.Config
    },
  };
};