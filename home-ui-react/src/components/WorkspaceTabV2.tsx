import React, { Fragment, useCallback, useEffect, useState } from 'react'
import WorkspaceTabOptionsButton from './OptionsButton'
import LockedIcon from './LockedIcon'
import { Workspace, WorkspaceLockConfig } from './types'
import {
  WorkspaceTabComponentProps,
  WorkspaceTitle,
  WorkspaceIconButton,
  WorkspaceTabCloseButton,
} from '@interopio/workspaces-ui-react'
import withIOInstance from '../hooks/withIOInstance'

const WorkspaceTabV2: React.FC<WorkspaceTabComponentProps> = ({
  io,
  isPinned,
  title,
  onCloseClick,
  onSaveClick,
  icon,
  showSaveButton,
  showCloseButton,
  workspaceId,
}) => {
  const [lockConfig, setLockConfig] = useState<WorkspaceLockConfig>({})

  useEffect(() => {
    let unsub = () => {}
    let mounted = true
    if (!io) {
      throw new Error(
        'The io object should either be attached to the window or passed in the context'
      )
    }

    io.workspaces.getWorkspaceById(workspaceId).then((workspace: Workspace) => {
      if (mounted) {
        setLockConfig({
          allowDrop: workspace.allowDrop,
          allowExtract: workspace.allowExtract,
          allowDropBottom: workspace.allowDropBottom,
          allowSystemHibernation: workspace.allowSystemHibernation,
          allowDropLeft: workspace.allowDropLeft,
          allowSplitters: workspace.allowSplitters,
          allowDropRight: workspace.allowDropRight,
          allowWindowReorder: workspace.allowWindowReorder,
          allowDropTop: workspace.allowDropTop,
          allowWorkspaceTabExtract: workspace.allowWorkspaceTabExtract,
          allowWorkspaceTabReorder: workspace.allowWorkspaceTabReorder,
          showAddWindowButtons: workspace.showAddWindowButtons,
          showCloseButton: workspace.showCloseButton,
          showEjectButtons: workspace.showEjectButtons,
          showSaveButton: workspace.showSaveButton,
          showWindowCloseButtons: workspace.showWindowCloseButtons,
        })
      }

      workspace
        .onLockConfigurationChanged((config: any) => {
          if (!mounted) {
            return
          }
          setLockConfig({
            allowDrop: config.allowDrop,
            allowExtract: config.allowExtract,
            allowDropBottom: config.allowDropBottom,
            allowSystemHibernation: config.allowSystemHibernation,
            allowDropLeft: config.allowDropLeft,
            allowSplitters: config.allowSplitters,
            allowDropRight: config.allowDropRight,
            allowWindowReorder: config.allowWindowReorder,
            allowDropTop: config.allowDropTop,
            allowWorkspaceTabExtract: config.allowWorkspaceTabExtract,
            allowWorkspaceTabReorder: config.allowWorkspaceTabReorder,
            showAddWindowButtons: config.showAddWindowButtons,
            showCloseButton: config.showCloseButton,
            showEjectButtons: config.showEjectButtons,
            showSaveButton: config.showSaveButton,
            showWindowCloseButtons: config.showWindowCloseButtons,
          })
        })
        .then((un: any) => {
          unsub = un
        })
    })

    return () => {
      mounted = false
      unsub()
    }
  }, [workspaceId, io])

  const closeWorkspace = useCallback(() => {
    if (!io) {
      throw new Error(
        'The io object should either be attached to the window or passed in the context'
      )
    }
    io.workspaces.getWorkspaceById(workspaceId).then((w: Workspace) => {
      return w.close()
    })
  }, [workspaceId, io])

  const isLocked = useCallback(() => {
    const lockConfigCopy = { ...lockConfig }

    const desktopGlobal = (window as any).glue42gd || (window as any).iodesktop

    if (!desktopGlobal) {
      delete lockConfigCopy.allowWorkspaceTabExtract
    }

    return Object.values(lockConfigCopy).some((v) => !v)
  }, [lockConfig])

  return (
    <div className="tab-item-v2" title={title}>
      {isPinned ? (
        <WorkspaceIconButton icon={icon} />
      ) : (
        <WorkspaceTabOptionsButton
          showSaveButton={showSaveButton}
          closeWorkspace={closeWorkspace}
          lockConfig={lockConfig}
          workspaceId={workspaceId}
        />
      )}
      <i className="lm_left" />
      {!isPinned && <WorkspaceTitle title={title} />}
      {isLocked() ? <LockedIcon lockConfig={lockConfig} workspaceId={workspaceId} /> : <Fragment />}
      {!isPinned && showCloseButton && <WorkspaceTabCloseButton close={onCloseClick} />}
      <i className="lm_right" />
    </div>
  )
}

export default withIOInstance(WorkspaceTabV2)
