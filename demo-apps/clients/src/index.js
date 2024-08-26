import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import IOBrowser from '@interopio/browser';
import IOWorkspaces from '@interopio/workspaces-api';
import { IOConnectProvider } from '@interopio/react-hooks';

import './index.css';
import './App.css';
import Clients from './Clients';
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
        <Clients />
    </IOConnectProvider>
);

serviceWorker.register();
