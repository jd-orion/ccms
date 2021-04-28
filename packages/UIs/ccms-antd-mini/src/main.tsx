import React from 'react'
import { CCMS } from 'ccms'
import { ICCMS } from 'ccms/dist/src/main'
import { PageHeader, Space } from 'antd'
import StepComponents from './steps'
import 'antd/lib/space/style/index.css'
import 'antd/lib/page-header/style/index.css'

export default class CCMSComponent extends CCMS {
  getStepComponent = (key: string) => StepComponents[key]

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
