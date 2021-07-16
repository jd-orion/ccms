
import { FetchStep } from 'ccms'
import { IAPIConditionSuccessModal, IAPIConditionFailModal } from 'ccms/dist/src/util/request'
import { FetchConfig } from 'ccms/dist/src/steps/fetch'
import { Modal } from 'antd'

export default class FetchComponent extends FetchStep {
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
export const PropsType = (props: FetchConfig) => { };
