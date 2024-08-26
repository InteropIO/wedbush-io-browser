import { SET_CLIENT_METHOD, SHARED_CONTEXT_NAME } from './constants';

export const openStocks = (io) => () => {
    // The `name` and `url` parameters are required. The window name must be unique.
    const name = `Stocks-${Date.now()}`;
    const URL = 'http://localhost:3001/';

    // Open a Window programmatically (at Runtime)
    io.windows.open(name, URL).catch(console.error);
};

export const setClientPortfolioInterop =
    (io) =>
    ({ clientId, clientName }) => {
        // Check whether the method exists.
        const isMethodRegistered = io.interop
            .methods()
            .some(({ name }) => name === SET_CLIENT_METHOD.name);

        if (isMethodRegistered) {
            // Invoke an Interop method by name and provide arguments for the invocation.
            io.interop.invoke(SET_CLIENT_METHOD.name, { clientId, clientName });
        }
    };

// Shared Context
export const setClientPortfolioSharedContext =
    (io) =>
    ({ clientId = '', clientName = '', portfolio = '' }) => {
        io.contexts.update(SHARED_CONTEXT_NAME, {
            clientId,
            clientName,
            portfolio,
        });
    };

export const startApp = (io) => async () => {
    // Retrieve an App by name
    const stocksApp = io.appManager.application('Stocks');

    // Get the current Channel's name
    const currentChannel = io.channels.my();

    // Start an instance of the stocksApp
    stocksApp.start(
        {},
        {
            // Start the app in the current Channel
            channelId: currentChannel,
        }
    );
};

// Channels
export const setClientPortfolioChannels =
    (io) =>
    ({ clientId = '', clientName = '' }) => {
        // Check whether the user is on any Channel
        if (io.channels.my()) {
            // Publish data to the current Channel
            io.channels
                .publish({
                    clientId,
                    clientName,
                })
                .catch(console.error);
        }
    };

// Workspaces
export const handleSelectClient = (io) => async (client) => {
    try {
        const isWindowInWorkspace = await io.workspaces.inWorkspace();

        if (isWindowInWorkspace) {
            // If the Window is part of a Workspace: update the Workspace Context
            const myWorkspace = await io.workspaces.getMyWorkspace();
            await myWorkspace.setContext(client);
        } else {
            // If the Window is not part of a Workspace: restore the Workspace and update its Context
            const workspace = await io.workspaces.restoreWorkspace('Client Details Workspace', {
                context: client,
            });

            await raiseNotificationOnWorkspaceOpen(io, client.clientName, workspace);
        }
    } catch (error) {
        console.error(error);
    }
};

// Notifications
export const raiseNotificationOnWorkspaceOpen = async (io, clientName, workspace) => {
    const options = {
        title: 'New Workspace',
        body: `A new Workspace for ${clientName} was opened!`,
    };

    const notification = await io.notifications.raise(options);

    notification.onclick = async () => {
        const allWorkspaces = await io.workspaces.getAllWorkspaces();
        const isCurrentWorkspaceOpen = allWorkspaces.some(({ id }) => id === workspace.id);

        // Check whether the Workspace we are trying to focus is not closed by the user
        if (isCurrentWorkspaceOpen) {
            // Focus the Workspace for the respective client.
            workspace.focus().catch(console.error);

            // Focus the Workspaces App.
            workspace.frame.focus().catch(console.error);
        }
    };
};
