// Workspaces
export const setClientFromWorkspace = (setClient) => async (io) => {
  const workspaceId = (await io.windows.my().getContext()).workspaceId;

  const myWorkspace =
    (await io.workspaces?.getAllWorkspaces())?.find(
      ({ id }) => id === workspaceId
    ) || (await io.workspaces?.getMyWorkspace());

  if (!myWorkspace) return;

  myWorkspace.onContextUpdated((context) => {
    if (context) {
      setClient(context);

      if (context.clientName) {
        myWorkspace.setTitle(context.clientName);
      }
    }
  });
};
