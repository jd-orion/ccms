import Step, { StepConfig, StepProps } from '../common'
import InterfaceHelper, { InterfaceConfig } from '../../util/interface'
import { merge } from 'lodash'

export interface FetchConfig extends StepConfig {
  type: 'fetch'
  interface?: InterfaceConfig
  nextStep?: boolean | string
}

interface FetchState {

}

export default class FetchStep extends Step<FetchConfig, FetchState> {
  interfaceHelper = new InterfaceHelper()
  stepPush = async () => {
    this.stepMount()
  }
  
  stepPop = async (reload: boolean = false, data?: any) => {
    if (reload) {
      this.stepMount(data)
    } else {
      this.props.onUnmount()
    }
  }

  stepMount = async (init_data?: any) => {
    const {
      config,
      onUnmount,
      onSubmit
    } = this.props

    
    if (config.interface) {
      try {
        const content = await this.interfaceHelper.request(
          merge(config.interface, { cache: { disabled: true } }),
          {...(init_data || {}), ...(this.props.data[this.props.step] || {})},
          {
            data: this.props.data,
            step: this.props.step
          },
          {
            loadDomain: this.props.loadDomain,
            extra_data: init_data
          }
        )
        onSubmit({ ...(init_data || {}), ...content })
      } catch (e) {
        onUnmount(true)
      }
    }
  }
}
