import { InterfaceHelper as _InterfaceHelper } from "ccms"
import { IRenderFailModal, IRenderSuccessModal } from "ccms/dist/src/util/interface"
import { Modal } from "antd"

export default class InterfaceHelper extends _InterfaceHelper {
  renderSuccessModal (props: IRenderSuccessModal) {
    return new Promise((resolve) => {
      Modal.success({
        title: props.message,
        onOk: () => {
          resolve(null)
        },
        getContainer: () => document.getElementById('ccms-antd') || document.body
      })
    })
  }

  renderFailModal (props: IRenderFailModal) {
    return new Promise((resolve) => {
      Modal.error({
        title: props.message,
        onOk: () => {
          resolve(null)
        },
        getContainer: () => document.getElementById('ccms-antd') || document.body
      })
    })
  }
}