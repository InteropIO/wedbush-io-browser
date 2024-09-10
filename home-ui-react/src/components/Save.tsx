import React from 'react'
import { SaveWorkspacePopup } from '@interopio/workspaces-ui-react'
import BackButton from './BackButton'

interface SaveProps {
  hidePopup: () => void
  resizePopup?: (size: any) => void
  workspaceId: string
  onBackClick: () => void
}

const Save: React.FC<SaveProps> = (props) => {
  return (
    <div>
      <BackButton onClick={props.onBackClick} />
      <SaveWorkspacePopup resizePopup={props.resizePopup!} {...props} />
    </div>
  )
}

export default Save
