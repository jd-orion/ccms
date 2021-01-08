import { Fetch } from 'ccms-core'
import { IFetchSuccessModal, IFetchFailModal } from 'ccms-core/dist/src/steps/fetch'
import { Modal } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/lib/modal/style/index.css'
import 'antd/lib/button/style/index.css'

export default class FetchComponent extends Fetch {
  renderSuccessModal = (props: IFetchSuccessModal) => {
    Modal.success({
      content: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }

  renderFailModal = (props: IFetchFailModal) => {
    Modal.error({
      content: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }
}
