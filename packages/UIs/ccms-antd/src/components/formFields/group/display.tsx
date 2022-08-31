import React from 'react'
import { GroupDisplay } from 'ccms'
import { IGroupField, GroupFieldConfig } from 'ccms/dist/components/formFields/group'
import { IFormItem } from 'ccms/dist/steps/form'
import { Form } from 'antd'
import { display as getALLComponents } from '..'
import styles from './index.less'
import { formItemLayout, computedItemStyle, computedGapStyle } from '../common'

export const PropsType = (props: GroupFieldConfig) => {}

export default class GroupDisplayComponent extends GroupDisplay {
  getALLComponents = (type: any) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
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

  renderItemComponent = (props: IFormItem) => {
    const { key, columns, layout, label, visitable, fieldType, children } = props

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
          // {...formItemLayout(layout, fieldType, label)}
          className={styles[`ccms-antd-mini-form-${fieldType}`]}
          style={itemStyle}
        >
          {children}
        </Form.Item>
      </div>
    )
  }
}
