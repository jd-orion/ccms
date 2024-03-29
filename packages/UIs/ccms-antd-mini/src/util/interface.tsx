import { InterfaceHelper as _InterfaceHelper } from 'ccms'
import { IRenderFailModal, IRenderSuccessModal } from 'ccms/dist/src/util/interface'
import { Modal } from 'antd'

export default class InterfaceHelper extends _InterfaceHelper {
  renderSuccessModal: (props: IRenderSuccessModal) => Promise<void> = (props) => {
    return new Promise((resolve) => {
      Modal.success({
        title: props.message,
        onOk: () => {
          resolve()
        }
      })
    })
  }

  renderFailModal: (props: IRenderFailModal) => Promise<void> = (props) => {
    return new Promise<void>((resolve) => {
      Modal.error({
        title: props.message,
        onOk: () => {
          resolve()
        }
      })
    })
  }
}
