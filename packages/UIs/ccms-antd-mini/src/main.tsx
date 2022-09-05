import React from 'react'
import { CCMS } from 'ccms'
import { ICCMS } from 'ccms/dist/main'
import { ConfigProvider, PageHeader, Space } from 'antd'
import 'antd/lib/config-provider/style'
import 'antd/lib/page-header/style'
import 'antd/lib/space/style'
import StepComponents from './steps'

export default class CCMSComponent extends CCMS {
  getStepComponent = (key: string) => StepComponents[key]

  renderComponent = (props: ICCMS) => {
    const { title, description, children } = props
    return (
      <ConfigProvider prefixCls="ccms-antd-mini-ant">
        <div id="ccms-antd-mini" className="ccms-antd-mini">
          <Space style={{ width: '100%' }} direction="vertical">
            <PageHeader title={title}>{description}</PageHeader>
            <div style={{ padding: '16px 0', margin: '0 24px', borderTop: '1px solid rgba(0,0,0,.06)' }}>
              {children}
            </div>
          </Space>
        </div>
      </ConfigProvider>
    )
  }
}
