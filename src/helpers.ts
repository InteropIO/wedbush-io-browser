// src/helpers.ts

import IOBrowserPlatform, { IOConnectBrowserPlatform } from '@interopio/browser-platform';
import IOWorkspaces from '@interopio/workspaces-api';
import { IOConnectInitSettings } from '@interopio/react-hooks';
import config from './config.json'
import appConfig from './settings/appConfig';

export const getIOConfig = (): IOConnectInitSettings => {
  return {
    browserPlatform: {
      factory: IOBrowserPlatform,
      config: Object.assign({} as any, config.browserPlatform,
        {
          browser: { libraries: [IOWorkspaces] },
          serviceWorker: { url: "/service-worker.js" },
          licenseKey: appConfig.apiConnectLicense
        }
      ) as IOConnectBrowserPlatform.Config
    },
  };
};