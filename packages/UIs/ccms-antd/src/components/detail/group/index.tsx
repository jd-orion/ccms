import React from "react";
import { DetailGroupField } from 'ccms';
import { IGroupField, GroupFieldConfig } from "ccms/dist/src/components/detail/group";
import { IDetailItem } from "ccms/dist/src/steps/detail";
import { Form } from "antd"
import getALLComponents from '../'
import styles from './index.less'
import { formItemLayout } from "../common";

export const PropsType = (props: GroupFieldConfig) => { };

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
      layout,
      label,
      fieldType,
      children
    } = props

    return (
      <Form.Item
        label={label}
        {...formItemLayout(layout, fieldType, label)}
        className={styles[`ccms-antd-mini-form-${fieldType}`]}
      >
        {children}
      </Form.Item>
    )
  }
}