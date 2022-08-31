import React from 'react'
import { DetailImportSubformField } from 'ccms'
import { IImportSubformField } from 'ccms/dist/components/detail/importSubform'
import { Display } from 'ccms/dist/components/formFields/common'
import { IDetailItem } from 'ccms/dist/steps/detail'
import { Form } from 'antd'
import { display as getALLComponents } from '../../formFields'
import InterfaceHelper from '../../../util/interface'
import styles from './index.less'
import { formItemLayout, computedItemStyle, computedGapStyle } from '../../formFields/common'

export default class ImportSubformField extends DetailImportSubformField {
  getALLComponents = (type: any): typeof Display => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IImportSubformField) => {
    const { columns, children } = props
    const gap = computedGapStyle(columns, 'row')
    return (
      <div
        style={{
          ...gap
        }}
        className={styles['ccms-antd-mini-form-group-row']}
      >
        {children}
      </div>
    )
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent = (props: IDetailItem) => {
    const { key, label, columns, layout, visitable, fieldType, children } = props
    const colStyle = computedItemStyle(columns, layout, visitable)
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
    if (columns?.type === 'width' && columns?.value && columns.wrap) {
      Object.assign(itemStyle, { width: columns.value })
    }

    return (
      <div
        style={colStyle}
        key={key}
        className={[styles['form-group-col'], styles[`form-group-col-${fieldType}`]].join(' ')}
      >
        <Form.Item
          key={key}
          label={label}
          className={styles[`ccms-antd-mini-detail-${fieldType}`]}
          // {...formItemLayout(layout, fieldType, label)}
          style={itemStyle}
        >
          {children}
        </Form.Item>
      </div>
    )
  }
}
