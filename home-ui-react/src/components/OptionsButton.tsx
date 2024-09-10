import React, { useCallback, useEffect, useRef, useState } from 'react'
import OptionsPopup from './OptionsPopup'
import { WorkspaceLockConfig } from './types'
import icon from './logo.svg'

interface OptionsButtonProps {
  workspaceId: string
  lockConfig: WorkspaceLockConfig
  closeWorkspace: () => void
  showSaveButton: boolean
}

const OptionsButton: React.FC<OptionsButtonProps> = ({
  workspaceId,
  lockConfig,
  closeWorkspace,
  showSaveButton,
}) => {
  const [showPopup, setShowPopup] = useState(false)
  const buttonRef = useRef<HTMLSpanElement>(null)

  const hidePopup = useCallback(() => {
    setShowPopup(false)
  }, [])

  useEffect(() => {
    if (!buttonRef.current) {
      return
    }

    const button = buttonRef.current
    const clickListener = (e: MouseEvent) => {
      e.stopPropagation()

      setShowPopup((s) => !s)
    }

    button.addEventListener('click', clickListener)

    return () => {
      button?.removeEventListener('click', clickListener)
    }
  }, [])

  const getButtonBounds = (): any => {
    if (!buttonRef.current) {
      return {}
    }

    const button = buttonRef.current
    const bounds = button.getBoundingClientRect()
    return {
      left: bounds.left,
      top: bounds.top,
      right: bounds.right,
      bottom: bounds.bottom,
    }
  }

  return (
    <>
      {showPopup && (
        <OptionsPopup
          closeWorkspace={closeWorkspace}
          showSaveButton={showSaveButton}
          lockConfig={lockConfig}
          workspaceId={workspaceId}
          hidePopup={hidePopup}
          buttonBounds={getButtonBounds()}
        />
      )}
      {/* This is the original implementation */}
      {/* <span ref={buttonRef} style={{ cursor: 'pointer' }} className="icon-ellipsis-vert"></span> */}

      {/* Example with changed icon to be an Image */}
      <span ref={buttonRef} style={{ cursor: 'pointer', height: '15px', width: '30px' }}>
        <img src={icon} alt="display icon" />
      </span>
    </>
  )
}

export default OptionsButton
