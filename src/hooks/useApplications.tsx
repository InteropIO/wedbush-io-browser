import { useState, useContext, useEffect } from 'react'
import { IOConnectContext } from '@interopio/react-hooks'
import { IOConnectBrowser } from '@interopio/browser'

export const useApplications = () => {
  const [applications, setApplications] = useState<IOConnectBrowser.AppManager.Application[]>([])

  const io = useContext(IOConnectContext)

  useEffect(() => {
    if (!io) {
      return
    }

    const unsubscribeOnAppAdded = io.appManager.onAppAdded((addedApplication) => {
      if (addedApplication.userProperties.hidden) {
        return
      }
      setApplications((prevApplications) => [...prevApplications, addedApplication])
    })

    const unsubscribeOnAppChanged = io.appManager.onAppChanged((changedApplication) => {
      setApplications((prevApplications) => [
        ...prevApplications.filter((application) => application.name !== changedApplication.name),
        changedApplication,
      ])
    })

    const unsubscribeOnAppRemoved = io.appManager.onAppRemoved((removedApplication) => {
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application.name !== removedApplication.name)
      )
    })

    const unsubscribeFns = [unsubscribeOnAppAdded, unsubscribeOnAppRemoved, unsubscribeOnAppChanged]

    return () => unsubscribeFns.forEach((unsubscribeFn) => unsubscribeFn())
  }, [io])

  return applications
}
