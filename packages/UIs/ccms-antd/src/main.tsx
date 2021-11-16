import React from 'react'
import { CCMS } from 'ccms'
import { ICCMS, CCMSProps } from 'ccms/dist/src/main'
import { PageHeader, Space } from 'antd'
import StepComponents from './steps'
import styles from "./main.less"
export default class CCMSComponent extends CCMS {
  getStepComponent = (key: string) => StepComponents[key]

  renderComponent = (props: ICCMS) => {
    const {
      title,
      description,
      children
    } = props
    return (
      <div id="ccms-antd" className={styles['ccms-antd']}>
        {
          (title || description) &&
          <div className={styles['header']}>
            <PageHeader title={title} style={{ padding: 0 }}>
              {description}
            </PageHeader>
          </div>
        }
        <div className={styles['content']}>
          {children}
        </div>
      </div>
    )
  }
}

export const PropsType = (props: CCMSProps) => { }
export const PropsTypeCCMS = (props: CCMS) => { }
