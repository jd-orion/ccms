import React from 'react'
import { SkipStep } from 'ccms'
import { SkipConfig } from 'ccms/dist/src/steps/skip'
import FieldComponents from '../../components/formFields'

export default class SkipStepComponent extends SkipStep {
  getFieldComponents = (type: string) => FieldComponents[type]

  renderComponent = () => {
    return <></>
  }

  renderItemComponent = () => {
    return <></>
  }
}
export const PropsType = (props: SkipConfig ) => { };
