import React from 'react'
import { GroupField } from 'ccms'
import { IGroupField, GroupFieldConfig } from 'ccms/dist/src/components/formFields/group'
import { IFormItem } from 'ccms/dist/src/steps/form'
import { Form } from 'antd'
import getALLComponents from '..'
import commonStyles from '../common.less'
import styles from './index.less'
import { formItemLayout, computedItemStyle, computedGapStyle, FiledErrMsg } from '../common'

export const PropsType = (props: GroupFieldConfig) => { }

export default class GroupFieldComponent extends GroupField {
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
    const { key, layout, columns, label, subLabel, visitable, status, message, extra, required, fieldType, children } =
      props

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
          extra={extra ? extra.trim() : ''}
          required={required}
          key={key}
          label={label}
          {...formItemLayout(layout, fieldType, label)}
          validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
          help={FiledErrMsg({ message, fieldType })}
          className={styles[`ccms-antd-mini-form-${fieldType}`]}
          // className={ [styles[`ccms-antd-mini-form-${fieldType}`], layout === 'horizontal' && subLabel ? commonStyles['ccms-antd-label-vertical-flex-start']: null].join(' ') }
          style={itemStyle}
        >
          {subLabel || null}
          {children}
        </Form.Item>
      </div>
    )
  }
}
