import React from 'react'
import { Button, Form, Space } from 'antd'
import { FormProps } from 'antd/lib/form'
import { DetailStep } from 'ccms'
import { IDetail, IDetailItem, DetailConfig } from 'ccms/dist/src/steps/detail'

import getALLComponents from '../../components/detail'
import styles from "./index.less"
import { formItemLayout } from '../../components/formFields/common'
import newstyles from "../../main.less"

export default class DetailStepComponent extends DetailStep {
  getALLComponents = (type: any) => getALLComponents[type]

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
      <Form
        {...formItemLayout}
        layout={layout}
        className={newstyles['content']}
      >
        {children}
        {
          onBack && <Form.Item>
            <Space>
              {<Button onClick={() => onBack()}>{backText || '返回'}</Button>}
            </Space>
          </Form.Item>
        }
      </Form>
    )
  }

  renderItemComponent = (props: IDetailItem) => {
    const {
      key,
      layout,
      label,
      // status,
      fieldType,
      children
    } = props

    return (
      <Form.Item
        key = {key}
        label={label}
        {...formItemLayout(layout, fieldType, label)}
        className={styles[`ccms-antd-mini-form-${fieldType}`]}
      >
        {children}
      </Form.Item>
    )
  }
}
// <FormConfig, IForm>
export const PropsType = (props: IDetail) => {};

export const PropsTypeFormConfig = (props: DetailConfig) => {};
export const PropsTypeStep = (props: DetailStep) => {};