import React from 'react'
import { CCMS } from 'ccms-core'
import { ICCMS } from 'ccms-core/dist/src/main'
import { PageHeader, Space } from 'antd'
import 'antd/lib/space/style/index.css'
import 'antd/lib/page-header/style/index.css'
import FormStepComponent from './steps/form'
import FetchStepComponent from './steps/fetch'
import TableStepComponent from './steps/table'

export default class CCMSComponent extends CCMS {
  FormStep = FormStepComponent
  TableStep = TableStepComponent
  FetchStep = FetchStepComponent

  renderComponent = (props: ICCMS) => {
    const {
      title,
      description,
      children
    } = props
    return (
      <Space style={{ width: '100%' }} direction="vertical">
        <PageHeader
          title={title}
        >
          {description}
        </PageHeader>
        <div style={{ padding: '16px 0', margin: '0 24px', borderTop: '1px solid rgba(0,0,0,.06)' }}>
        {children}
        </div>
      </Space>
    )
  }
}
