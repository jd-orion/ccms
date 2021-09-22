import React from 'react'
import { CCMS } from 'ccms'
import { ICCMS, CCMSProps } from 'ccms/dist/src/main'
import { PageHeader, Space, ConfigProvider } from 'antd'
import StepComponents from './steps'
import './style'

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
        {
          (title || description) &&
          <div style={{ borderBottom: '1px solid rgba(0,0,0,.06)' }}>
            <PageHeader title={title} >
              {description}
            </PageHeader>
          </div>
        }
        <div style={{ padding: '16px 0', margin: '0 24px' }}>
          {children}
        </div>
      </Space>
    )
  }
}

export const PropsType = (props: CCMSProps) => { }
export const PropsTypeCCMS = (props: CCMS) => { }
