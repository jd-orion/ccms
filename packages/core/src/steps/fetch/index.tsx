import { merge } from 'lodash'
import Step, { StepConfig } from '../common'
import InterfaceHelper, { InterfaceConfig } from '../../util/interface'

export interface FetchConfig extends StepConfig {
  type: 'fetch'
  interface?: InterfaceConfig
  nextStep?: boolean | string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FetchState {}

export default class FetchStep extends Step<FetchConfig, FetchState> {
  popData: object = {}

  interfaceHelper = new InterfaceHelper()

  stepPush = async () => {
    this.stepMount()
  }

  stepPop: (reload?: boolean, data?: unknown) => void = async (reload = false, data = {}) => {
    if (reload) {
      this.popData = data as object
      this.stepMount()
    } else {
      this.props.onUnmount()
    }
  }

  stepMount = async (initData?: object) => {
    const { config, onUnmount, onSubmit } = this.props

    if (config.interface) {
      try {
        const content = (await this.interfaceHelper.request(
          merge(config.interface, { cache: { disabled: true } }),
          { ...(this.popData || {}), ...(initData || {}), ...(this.props.step || {}) },
          {
            data: this.props.data,
            step: this.props.step,
            containerPath: '',
            record: {}
          },
          {
            loadDomain: this.props.loadDomain,
            extraData: { ...(this.popData || {}), ...(initData || {}) }
          }
        )) as object
        onSubmit({ ...(this.popData || {}), ...(initData || {}), ...content })
      } catch (e) {
        onUnmount(true)
      }
    }
  }
}
