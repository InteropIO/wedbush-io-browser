import IOBrowserPlatform, { IOConnectBrowserPlatform } from '@interopio/browser-platform';
import IOWorkspaces from '@interopio/workspaces-api';
import { IOConnectInitSettings } from '@interopio/react-hooks';
import config from './config.json'

export const getIOConfig = (): IOConnectInitSettings => {
  return {
    browserPlatform: {
      factory: IOBrowserPlatform,
      config: Object.assign({}, config.browserPlatform, { browser: { libraries: [IOWorkspaces] }, serviceWorker: { url: "/service-worker.js" } }) as IOConnectBrowserPlatform.Config,
    },
  };
};
