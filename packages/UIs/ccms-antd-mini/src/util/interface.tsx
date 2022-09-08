import { InterfaceHelper as _InterfaceHelper } from 'ccms'
import { IRenderFailModal, IRenderSuccessModal } from 'ccms/dist/util/interface'
import { ConfigProvider, Modal } from 'antd'
import 'antd/lib/config-provider/style'
import 'antd/lib/modal/style'

export default class InterfaceHelper extends _InterfaceHelper {
  renderSuccessModal: (props: IRenderSuccessModal) => Promise<void> = (props) => {
    return new Promise((resolve) => {
      ConfigProvider.config({
        prefixCls: 'ccms-antd-mini-ant'
      })
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
      ConfigProvider.config({
        prefixCls: 'ccms-antd-mini-ant'
      })
      Modal.error({
        title: props.message,
        onOk: () => {
          resolve()
        }
      })
    })
  }
}
