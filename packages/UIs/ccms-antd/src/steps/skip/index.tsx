import React from 'react'
import { SkipStep } from 'ccms'
import { IFilter, IFilterItem } from 'ccms/dist/src/steps/filter'
import { Button, Form, Space } from 'antd'
// import 'antd/lib/style/index.css'
// import 'antd/lib/form/style/index.css'
// import 'antd/lib/grid/style/index.css'
// import 'antd/lib/tooltip/style/index.css'
// import 'antd/lib/space/style/index.css'
// import 'antd/lib/button/style/index.css'
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
