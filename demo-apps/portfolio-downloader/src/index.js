import { createRoot } from 'react-dom/client';
import IOBrowser from '@interopio/browser';
import { IOConnectProvider } from '@interopio/react-hooks';

import PortfolioDownloader from './PortfolioDownloader';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const settings = {
    browser: {
        factory: IOBrowser,
    },
};

const root = createRoot(document.getElementById('root'));
root.render(
    <IOConnectProvider settings={settings}>
        <PortfolioDownloader />
    </IOConnectProvider>
);
