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

  const sections = applications.reduce(
    (acc, application, idx) => {
      const appItem = {
        id: application.name,
        title: application.title || application.name,
        description: application.caption,
        type: 'Application',
        iconSrc: application.icon,
        isOpen: runningInstances[application.name]?.length ? true : false,
        isExternal: application.userProperties?.isExternal,
        url: application.userProperties?.details?.url,
      } as BaseSectionItemType | BaseSectionType<BaseSectionItemType>

      const folderNames = application.userProperties?.tags

      if (!folderNames || folderNames.length === 0) {
        acc.items.push(appItem)
      } else {
        folderNames.forEach((folderName: string) => {
          let folderItem = acc.items.find((item: any) => item.title === folderName)

          if (folderItem) {
            folderItem.items.push(appItem)
          } else {
            acc.items.push({
              id: folderName + '-' + appItem.id + idx,
              title: folderName,
              items: [appItem],
            })
          }
        })
      }

      return acc
    },
    {
      id: 'custom-folder',
      title: 'Custom folder',
      items: [],
    } as any
  )

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

    if (item.isExternal) {
      // Specify location for the new window.
      const options = {
        top: 200,
        left: 200,
      }

      const ioWindow = await io.windows.open(item.title, item.url, options)
      const browserWindow = window.open(item.url, '_blank')

      // observe the IOWindow reference
      console.log('ioWindow', ioWindow)
      // observe the browser window reference
      console.log('browserWindow', browserWindow)

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
        items: [sections],
        iconSrc: icon,
        isCollapsible: true,
      }}
      onItemClick={startApplication}
    />
  )
}
