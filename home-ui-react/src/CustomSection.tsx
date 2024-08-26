import { Section, SectionType } from '@interopio/home-ui-react'
import { useContext, useEffect, useState } from 'react'
import { getFrameId } from '@interopio/workspaces-ui-react'
import { IOConnectContext } from '@interopio/react-hooks'
import { useApplications } from './hooks/useApplications'
import { useApplicationsInstances } from './hooks/useRunningInstances'
import { IOConnectBrowser } from '@interopio/browser'
import { IOConnectWorkspaces } from '@interopio/workspaces-api'
import icon from './logo.svg'
import {
  BaseSectionItemType,
  BaseSectionType,
} from '@interopio/home-ui-react/lib/base-section/types'

export const CustomSection = () => {
  const io = useContext(IOConnectContext) as IOConnectBrowser.API

  const applications = useApplications()
  const runningInstances = useApplicationsInstances()
  const [frame, setFrame] = useState<IOConnectWorkspaces.Frame | undefined>({} as any)

  const [first, second, ...applicationItems] = applications.map(
    (application) =>
      ({
        id: application.name,
        title: application.title || application.name,
        description: application.caption,
        type: 'Application',
        iconSrc: application.icon,
        isOpen: runningInstances[application.name]?.length ? true : false,
      } as BaseSectionItemType | BaseSectionType<BaseSectionItemType>)
  )

  const items: SectionType[] = [
    {
      id: 'custom-folder-test',
      title: 'Custom Folder',
      items: first ? [first] : [],
    },
    {
      id: 'custom-folder-test-2',
      title: 'Custom folder 2',
      items: [
        second || {},
        {
          id: 'custom-folder-test-nested',
          title: 'Custom Nested',
          items: applicationItems,
        },
      ],
    },
  ]

  useEffect(() => {
    const getFrame = async () => {
      const frameID = getFrameId()
      const frame = await io.workspaces?.waitForFrame(frameID)

      setFrame(frame)
    }

    try {
      getFrame()
    } catch (error) {
      console.error('Failed to get current frame', { error })
    }
  }, [io])

  const startApplication = async ({ item }: any) => {
    if (item.type !== 'Application') {
      return
    }

    if (!frame) {
      try {
        await io.appManager.application(item.id)?.start()
      } catch (error) {
        console.error('Failed to start application', { error })
      }

      return
    }

    try {
      const selectedWorkspace = ((await frame?.workspaces()) || []).find(
        (wsp: any) => wsp.isSelected === true
      )

      const targetElement =
        selectedWorkspace!.getBox((boxElement: any) => boxElement.type !== 'group') ||
        selectedWorkspace

      await (await targetElement.addGroup()).addWindow({ appName: item.id })
    } catch (error) {
      console.error('Failed to open application in workspace', { error })
    }
  }

  return (
    <Section
      config={{
        id: 'my-section-id',
        title: 'Custom Section',
        items,
        iconSrc: icon,
        isCollapsible: true,
      }}
      onItemClick={startApplication}
    />
  )
}
