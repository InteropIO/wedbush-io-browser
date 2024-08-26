import React from 'react';
import { createRoot } from 'react-dom/client';
import IOBrowser from '@interopio/browser';
import IOWorkspaces from '@interopio/workspaces-api';
import { IOConnectProvider } from '@interopio/react-hooks';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './App.css';
import Stocks from './Stocks';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById('root'));
root.render(
    <IOConnectProvider
        settings={{
            browser: {
                config: { libraries: [IOWorkspaces], appManager: 'full' },
                factory: IOBrowser,
            },
        }}
    >
        <Stocks />
    </IOConnectProvider>
);

serviceWorker.register();
