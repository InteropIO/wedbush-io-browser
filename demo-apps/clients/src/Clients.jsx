import React, { useContext, useEffect, useState } from 'react';
import { IOConnectContext, useIOConnect } from '@interopio/react-hooks';

import { REQUEST_OPTIONS } from './constants';
import { handleSelectClient } from './io-connect';

function Clients() {
    const [clients, setClients] = useState([]);
    const io = useContext(IOConnectContext);

    useEffect(() => {
        async function setMyWorkspaceId() {
            const inWsp = await io.workspaces?.inWorkspace();
            if (!inWsp) {
                return;
            }

            const myWorkspace = await io.workspaces?.getMyWorkspace();
            await io.windows.my().updateContext({
                workspaceId: myWorkspace?.id,
            });
        }

        setMyWorkspaceId();
    }, [io]);

    const selectClient = useIOConnect(handleSelectClient);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/clients', REQUEST_OPTIONS);
                const clients = await response.json();
                setClients(clients);
            } catch (e) {
                console.log(e);
            }
        };
        fetchClients();
    }, []);

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
                <div className="col-md-8">
                    <h1 className="text-center">Clients</h1>
                </div>
                <div className="col-md-2 py-2">
                    {/* <button className="btn btn-primary" onClick={onClickStocks}>
            Stocks
          </button> */}
                    {/* <button className="btn btn-primary" onClick={startStocksApp}>
            Stocks
          </button> */}
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table id="clientsTable" className="table table-hover">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>PID</th>
                                <th>GID</th>
                                <th>Account Manager</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(
                                ({ name, pId, gId, accountManager, portfolio, ...rest }) => (
                                    <tr
                                        key={pId}
                                        onClick={() => {
                                            // onClickClients({ clientId: gId, clientName: name });

                                            // onClickSharedContext({
                                            //   clientId: gId,
                                            //   clientName: name,
                                            //   portfolio,
                                            // });

                                            // onClickChannel({ clientId: gId, clientName: name });

                                            selectClient({
                                                clientId: gId,
                                                clientName: name,
                                                accountManager,
                                                portfolio,
                                                ...rest,
                                            });
                                        }}
                                    >
                                        <td>{name}</td>
                                        <td>{pId}</td>
                                        <td>{gId}</td>
                                        <td>{accountManager}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Clients;
