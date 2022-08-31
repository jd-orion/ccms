
import { FetchStep } from 'ccms'
import { FetchConfig } from 'ccms/dist/steps/fetch'
import InterfaceHelper from '../../util/interface'

export default class FetchComponent extends FetchStep {
  interfaceHelper = new InterfaceHelper()
}
export const PropsType = (props: FetchConfig) => { };
