import React, { useCallback, useEffect, useRef } from 'react'
import { Size } from '@interopio/workspaces-ui-react/dist/cjs/types/internal'
import BackButton from './BackButton'
import LockOption from './LockOption'
import { Workspace, WorkspaceLockConfig } from './types'
import withIOInstance from '../hooks/withIOInstance'

interface LockOptionsProps {
  io?: any
  workspaceId: string
  lockConfig: WorkspaceLockConfig
  onBackClick: () => void
  resizePopup?: (size: Size) => void
  showBackButton: boolean
}

const LockOptions: React.FC<LockOptionsProps> = ({
  workspaceId,
  lockConfig,
  onBackClick,
  resizePopup,
  showBackButton,
  io,
}) => {
  const allowOptionsNameMap = (k: string) =>
    k
      .replace('allow', '')
      .replace(/([A-Z][a-z])/g, ' $1')
      .trim()
  const showOptionsNameMap = (k: string) =>
    k
      .replace('show', '')
      .replace(/([A-Z][a-z])/g, ' $1')
      .replace('Buttons', '')
      .replace('Button', '')
      .trim()

  const generateOptions = useCallback(
    (filter: (key: keyof WorkspaceLockConfig) => boolean, nameMap: (key: string) => string) =>
      Object.keys(lockConfig)
        .filter(filter as any)
        .map((key, i) => {
          const typedKey = key as keyof WorkspaceLockConfig
          const onChange = (newValue: boolean) => {
            if (!io) {
              throw new Error(
                'The io object should either be attached to the window or passed in the context'
              )
            }
            io.workspaces.getWorkspaceById(workspaceId).then((workspace: Workspace) => {
              return workspace.lock({
                ...lockConfig,
                [key]: !newValue,
              })
            })
          }

          return (
            <LockOption
              key={nameMap(key)}
              name={nameMap(key)}
              value={!lockConfig[typedKey]}
              onChange={onChange}
            />
          )
        }),
    [workspaceId, lockConfig, io]
  )

  const coreCompatibleFilter = (constraint: keyof WorkspaceLockConfig) => {
    const desktopGlobal = (window as any).glue42gd || (window as any).iodesktop

    if (
      !desktopGlobal &&
      (constraint === 'allowDrop' || constraint === 'allowWorkspaceTabExtract')
    ) {
      return false
    }

    return true
  }

  const generateAllowOptions = () =>
    generateOptions((k) => k.startsWith('allow') && coreCompatibleFilter(k), allowOptionsNameMap)
  const generateShowOptions = () => generateOptions((k) => k.startsWith('show'), showOptionsNameMap)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    resizePopup!({
      width: Math.ceil(ref.current.getBoundingClientRect().width),
      height: Math.ceil(ref.current.getBoundingClientRect().height),
    })
  }, [resizePopup, lockConfig])

  const toggleAll = (newValue: boolean) => {
    if (!io) {
      throw new Error(
        'The io object should either be attached to the window or passed in the context'
      )
    }
    io.workspaces.getWorkspaceById(workspaceId).then((workspace: Workspace) => {
      const newLockConfig = Object.keys(lockConfig).reduce((acc: any, key) => {
        acc[key] = !newValue
        return acc
      }, {})

      return workspace.lock(newLockConfig)
    })
  }

  const isLocked = useCallback(() => {
    const lockConfigCopy = { ...lockConfig }

    const desktopGlobal = (window as any).glue42gd || (window as any).iodesktop

    if (!desktopGlobal) {
      delete lockConfigCopy.allowWorkspaceTabExtract
    }

    return Object.values(lockConfigCopy).some((v) => !v)
  }, [lockConfig])
  const enableName = 'Unlock All'
  const disableName = 'Lock All'

  return (
    <>
      {showBackButton && <BackButton onClick={onBackClick} />}
      <div ref={ref} className="p-3 lock-options-list">
        <div className="mb-2">
          <LockOption
            name={isLocked() ? enableName : disableName}
            value={isLocked()}
            onChange={toggleAll}
          />
        </div>
        <h5>Disable</h5>
        <hr className="my-2" />
        <div className="allow-show-gird">{generateAllowOptions()}</div>
        <h5 className="pt-3">Hide Buttons</h5>
        <hr className="my-2" />
        <div className="allow-show-gird">{generateShowOptions()}</div>
      </div>
    </>
  )
}

export default withIOInstance(LockOptions)
