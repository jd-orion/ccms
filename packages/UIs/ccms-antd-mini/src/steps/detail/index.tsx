import React from 'react'
import { DetailStep } from 'ccms'
import { IDetail, IDetailItem } from 'ccms/dist/steps/detail'
import { Button, Form, Space } from 'antd'
import 'antd/lib/button/style'
import 'antd/lib/form/style'
import 'antd/lib/space/style'
import { FormItemProps, FormProps } from 'antd/lib/form'
import getALLComponents from '../../components/detail'
import './index.less'

export default class DetailStepComponent extends DetailStep {
  getALLComponents = (type) => getALLComponents[type]

  renderComponent = (props: IDetail) => {
    const {
      layout, // layout??
      onBack,
      backText,
      children
    } = props

    const formItemLayout: FormProps | null =
      layout === 'horizontal'
        ? {
            labelAlign: 'left',
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }
        : null
    return (
      <Form layout={layout} {...formItemLayout} size="small">
        {children}
        {onBack && (
          <Form.Item>
            <Space>
              <Button onClick={() => onBack()}>{backText || '返回'}</Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    )
  }

  renderItemComponent = (props: IDetailItem) => {
    const { key, label, visitable, fieldType, children } = props

    const formItemLayout: FormItemProps = {}
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'import_subform') {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
    } else if (fieldType === 'switch' || fieldType === 'text') {
      formItemLayout.labelCol = { span: 10 }
    }

    return (
      <Form.Item
        key={key}
        label={label}
        {...formItemLayout}
        className={`ccms-antd-mini-form-${fieldType}`}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }
}
