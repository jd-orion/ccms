import { Fetch } from 'ccms-core'
import { IAPIConditionSuccessModal, IAPIConditionFailModal } from 'ccms-core/dist/src/util/request'
import { Modal } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/lib/modal/style/index.css'
import 'antd/lib/button/style/index.css'

export default class FetchComponent extends Fetch {
  renderSuccessModal = (props: IAPIConditionSuccessModal) => {
    Modal.success({
      content: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }

  renderFailModal = (props: IAPIConditionFailModal) => {
    Modal.error({
      content: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }
}
