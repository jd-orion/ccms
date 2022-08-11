import React from 'react'
import { OperationHelper as _OperationHelper } from 'ccms'
import { Modal } from 'antd'
import CCMS from '../main'

export default class OperationHelper extends _OperationHelper {
  protected renderModal = (props) => {
    return (
      <Modal
        visible
        forceRender
        title={props.title}
        footer={null}
        getContainer={() => document.getElementById('ccms-antd') || document.body}
        onCancel={() => props.onClose()}
      >
        {props.content}
      </Modal>
    )
  }

  protected renderCCMS = (props) => {
    return <CCMS {...props} />
  }
}
