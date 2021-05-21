import Step, { StepConfig } from '../common'
import { APIConditionConfig, APIConfig } from '../../interface'
import { IAPIConditionFailModal, IAPIConditionSuccessModal, request, requestCondition } from '../../util/request'
import { getValue } from '../../util/value'

export interface FetchConfig extends StepConfig {
  type: 'fetch'
  request: APIConfig
  response: {
    root: string
  }
  condition?: { enable: false } | APIConditionConfig
}

interface FetchState {

}

export default class FetchStep extends Step<FetchConfig, FetchState> {
  willMount = async () => {
    const {
      config,
      data,
      step,
      onUnmount,
      onSubmit
    } = this.props

    try {
      const response = await request(config.request, data[step])

      if (config.condition && config.condition.enable) {
        const condition = await requestCondition(config.condition, response, this.renderSuccessModal, this.renderFailModal)
        if (condition) {
          const root = config.response.root || "";
          onSubmit(getValue(response, root), false)
        } else {
          onUnmount()
        }
      } else {
        onSubmit(response, false)
      }
    } catch (e) {
      this.renderFailModal({
        message: '网络错误',
        onOk: () => onUnmount()
      })
    }
  }

  renderSuccessModal = (props: IAPIConditionSuccessModal) => {
    const mask = document.createElement('DIV')
    mask.style.position = 'fixed'
    mask.style.left = '0px'
    mask.style.top = '0px'
    mask.style.width = '100%'
    mask.style.height = '100%'
    mask.style.backgroundColor = 'white'
    mask.innerText = '您当前使用的UI版本没有实现Fetch的SuccessModal组件。'
    mask.onclick = () => {
      mask.remove()
      props.onOk()
    }

    document.body.appendChild(mask)
  }

  renderFailModal = (props: IAPIConditionFailModal) => {
    const mask = document.createElement('DIV')
    mask.style.position = 'fixed'
    mask.style.left = '0px'
    mask.style.top = '0px'
    mask.style.width = '100%'
    mask.style.height = '100%'
    mask.style.backgroundColor = 'white'
    mask.innerText = '您当前使用的UI版本没有实现Fetch的FailModal组件。'
    mask.onclick = () => {
      mask.remove()
      props.onOk()
    }

    document.body.appendChild(mask)
  }
}
