import { IOConnectContext, useIOConnect } from '@interopio/react-hooks';
import React, { useEffect, useState } from 'react';

import { useContext } from 'react';
import { REQUEST_OPTIONS } from './constants';
import {
    createInstrumentStream,
    openStockDetails,
    registerSetClientMethod,
    setClientPortfolioSharedContext,
    subscribeForInstrumentStream,
    subscribeForChannels,
    raiseExportPortfolioIntentRequest,
    setClientFromWorkspace,
    openStockDetailsInWorkspace,
} from './io-connect';

function Stocks() {
    const [portfolio, setPortfolio] = useState([]);
    const [client, setClient] = useState({}); // { clientId, clientName }
    // The prices will be updated when new data is received from the stream.
    const [prices, setPrices] = useState({});
    const io = useContext(IOConnectContext);

    // Workspaces
    const showStockDetails = useIOConnect(openStockDetailsInWorkspace);

    useIOConnect(setClientFromWorkspace(setClient));

    // Register the Stream:
    useIOConnect(createInstrumentStream);

    // Raise an Intent:
    const exportPortfolioButtonHandler = useIOConnect(raiseExportPortfolioIntentRequest);

    // Create a stream subscription that will be renewed every time the `portfolio` changes.
    const subscription = useIOConnect(
        (io, portfolio) => {
            if (portfolio.length > 0) {
                return subscribeForInstrumentStream(setPrices)(io, portfolio);
            }
        },
        [portfolio]
    );

    const { clientId, clientName } = client;

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                // Close the existing subscription when a new client has been selected.
                if (subscription && typeof subscription.close === 'function') {
                    subscription.close();
                }

                const url = `http://localhost:8080/${
                    clientId ? `api/portfolio/${clientId}` : 'api/portfolio/'
                }`;
                const response = await fetch(url, REQUEST_OPTIONS);
                const portfolio = await response.json();
                setPortfolio(portfolio);
            } catch (e) {
                console.log(e);
            }
        };
        fetchPortfolio();
    }, [clientId]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    {!io && (
                        <span id="ioSpan" className="badge badge-warning">
                            io.Connect is unavailable
                        </span>
                    )}
                    {io && (
                        <span id="ioSpan" className="badge badge-success">
                            io.Connect is available
                        </span>
                    )}
                </div>
                {clientId && clientName && (
                    <h4 className="p-3">
                        Client {clientName} - {clientId}
                    </h4>
                )}
                <div className="col-md-8">
                    <h1 id="title" className="text-center">
                        Stocks
                    </h1>
                </div>
                <div className="col-md-2 py-2">
                    <button
                        type="button"
                        className="mb-3 mr-3 btn btn-primary btn-sm"
                        onClick={() => setClient({})}
                    >
                        Show All
                    </button>
                    <button
                        type="button"
                        className="mb-3 btn btn-primary btn-sm"
                        // Clicking on the "Export Portfolio" button will start the Portfolio Downloader app
                        // which will start downloading the portfolio of the currently selected client in JSON format
                        onClick={() => exportPortfolioButtonHandler(portfolio, clientName)}
                    >
                        Export Portfolio
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table id="portfolioTable" className="table table-hover">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Description</th>
                                <th className="text-right">Bid</th>
                                <th className="text-right">Ask</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map(({ RIC, Description, Bid, Ask, ...rest }) => (
                                <tr
                                    key={RIC}
                                    onClick={() => {
                                        showStockDetails({
                                            RIC,
                                            Description,
                                            Bid,
                                            Ask,
                                            ...rest,
                                        });
                                    }}
                                >
                                    <td>{RIC}</td>
                                    <td>{Description}</td>
                                    <td className="text-right">
                                        {prices[RIC] ? prices[RIC].Bid : Bid}
                                    </td>
                                    <td className="text-right">
                                        {prices[RIC] ? prices[RIC].Ask : Ask}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Stocks;
