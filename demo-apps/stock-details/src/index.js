import React from 'react';
import { createRoot } from 'react-dom/client';
import IOBrowser from '@interopio/browser';
import { IOConnectProvider } from '@interopio/react-hooks';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './App.css';
import StockDetails from './StockDetails';
import * as serviceWorker from './serviceWorker';
import IOWorkspaces from '@interopio/workspaces-api';

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
        <StockDetails />
    </IOConnectProvider>
);

serviceWorker.register();
