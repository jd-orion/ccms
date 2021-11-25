import React from "react"
import { OperationHelper as _OperationHelper } from "ccms"
import { Modal } from "antd"
import CCMS from "../main"
import { CCMSProps } from "ccms/dist/src/main"
import { IOperationModal } from "ccms/dist/src/util/operation"

export default class OperationHelper extends _OperationHelper {
  protected renderModal (props: IOperationModal) {
    return (
      <Modal
        visible={true}
        forceRender={true}
        title={props.title}
        footer={null}
        getContainer={() => document.getElementById('ccms-antd') || document.body}
        onCancel={() => props.onClose()}
      >
        {props.content}
      </Modal>
    )
  }

  protected renderCCMS (props: CCMSProps) {
    return <CCMS {...props} />
  }
}