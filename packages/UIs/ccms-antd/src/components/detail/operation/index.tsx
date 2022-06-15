import React from 'react'
import { DetailOperation } from 'ccms'
import { IButtonProps, IOperationDetail } from 'ccms/dist/src/components/detail/operation'
import { Button, Space } from 'antd'
import OperationHelper from '../../../util/operation'

export default class OperationDetailComponent extends DetailOperation {
  OperationHelper = OperationHelper

  renderComponent = (props: IOperationDetail) => {
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
