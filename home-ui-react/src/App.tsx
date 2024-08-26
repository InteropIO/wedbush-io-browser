import { useMemo } from 'react'
import {
  ApplicationsSection,
  FavoritesSection,
  IOConnectHome,
  IOConnectHomeConfig,
  Section,
  WorkspacesSection,
} from '@interopio/home-ui-react'
import { getIOConfig } from './helpers'
import '@interopio/workspaces-ui-react/dist/styles/workspaces.css'
import '@interopio/home-ui-react/index.css'
import icon from './logo.svg'

const items = [
  {
    id: 'custom-folder-test',
    title: 'Custom Folder',
    items: [
      {
        id: 'custom-item',
        title: 'Custom Item',
        type: 'Application',
      },
      {
        id: 'another-custom-item',
        title: 'Another Custom Item',
        type: 'Application',
      },
    ],
  },
]

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
                <Section
                  config={{
                    id: 'my-section-id',
                    title: 'Custom Section',
                    items,
                    iconSrc: icon,
                    isCollapsible: true,
                  }}
                  onItemClick={({ item }) => alert(`Clicked "${item.title}".`)}
                />
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
    }),
    []
  )

  return <IOConnectHome config={ioConnectHomeConfig} />
}

export default App
