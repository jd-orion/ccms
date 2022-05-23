import React from 'react'
import { OperationColumn } from 'ccms'
import { OperationColumnConfig, IButtonProps, IOperationColumn } from 'ccms/dist/src/components/tableColumns/operation'
import { Button, Space } from 'antd'
import OperationHelper from '../../../util/operation'

export const PropsType = (props: OperationColumnConfig) => {}

export default class OperationColumnComponent extends OperationColumn {
  OperationHelper = OperationHelper

  renderComponent = (props: IOperationColumn) => {
    const { actions } = props
    return <Space>{Array.isArray(actions) && actions}</Space>
  }

  renderButtonComponent = (props: IButtonProps) => {
    const { level, label, onClick } = props
    let type
    let danger
    if (level === 'danger') {
      type = 'default'
      danger = true
    } else {
      danger = false
      if (level === 'normal') {
        type = 'default'
      } else {
        type = level
      }
    }
    return (
      <Button type={type} danger={danger} onClick={() => onClick()}>
        {label}
      </Button>
    )
  }

  renderLinkComponent = (props: IButtonProps) => {
    const { level, label, onClick } = props
    const danger = level === 'danger'
    const style = level === 'primary' ? { fontWeight: 'bold' } : {}
    return (
      <Button type="link" style={style} danger={danger} onClick={() => onClick()}>
        {label}
      </Button>
    )
  }
}
