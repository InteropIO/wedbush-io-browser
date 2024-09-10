import { useMemo } from 'react'
import {
  ApplicationsSection,
  FavoritesSection,
  IOConnectHome,
  IOConnectHomeConfig,
  WorkspacesSection,
} from '@interopio/home-ui-react'
import { getIOConfig } from './helpers'
import '@interopio/workspaces-ui-react/dist/styles/workspaces.css'
import '@interopio/home-ui-react/index.css'
import { CustomSection } from './CustomSection'
import WorkspaceTabV2 from './components/WorkspaceTabV2'

export function App() {
  const ioConnectHomeConfig: IOConnectHomeConfig = useMemo(
    () => ({
      getIOConnectConfig: getIOConfig,
      launchpad: {
        components: {
          // Customizing the default sections.
          Sections: () => {
            return (
              <>
                <FavoritesSection />
                <ApplicationsSection isSectionCollapsible={true} showAllItems={true} />
                <WorkspacesSection isSectionCollapsible={true} />
                <CustomSection />
              </>
            )
          },
        },
      },
      login: {
        type: 'simple',
        onLogin: async (username, password) => {
          // Custom validation logic.
          // await validateUser(username, password);

          const user = { id: username, username, password }

          return user
        },
      },
      workspaces: {
        components: {
          header: {
            WorkspaceTabComponent: WorkspaceTabV2,
          },
        },
      },
    }),
    []
  )

  return <IOConnectHome config={ioConnectHomeConfig} />
}

export default App
