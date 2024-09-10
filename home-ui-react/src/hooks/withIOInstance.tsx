import { IOConnectContext } from '@interopio/react-hooks'
import React, { useContext } from 'react'

const withGlueInstance = <T extends { io?: any }>(WrappedComponent: React.ComponentType<T>) => {
  return (props: T) => {
    const io = props.io || (window as any).glue || useContext(IOConnectContext)
    if (!io) {
      throw new Error('An instance of IO is not provided')
    }
    return <WrappedComponent {...Object.assign({}, props, { io })} />
  }
}

export default withGlueInstance
