import React from 'react'
import { DetailGroupField } from 'ccms'
import { IGroupField, GroupFieldConfig } from 'ccms/dist/src/components/detail/group'
import { IDetailItem } from 'ccms/dist/src/steps/detail'
import { Form } from 'antd'
import { FormItemProps } from 'antd/lib/form'
import getALLComponents from '../'
import styles from './index.less'

export const PropsType = (props: GroupFieldConfig) => { }

export default class GroupFieldComponent extends DetailGroupField {
  getALLComponents = (type: any) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
    const {
      children
    } = props
    return (
      <div>
        {children}
      </div>
    )
  }

  renderItemComponent = (props: IDetailItem) => {
    const {
      label,
      visitable,
      fieldType,
      children
    } = props

    const formItemLayout: FormItemProps = { labelAlign: 'left' }
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'object' || fieldType === 'import_subform') {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
    } else {
      formItemLayout.labelCol = { span: 6 }
      formItemLayout.wrapperCol = { span: 18 }
    }

    return (
      <Form.Item
        label={label}
        {...formItemLayout}
        className={styles[`ccms-antd-mini-form-${fieldType}`]}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }
}
