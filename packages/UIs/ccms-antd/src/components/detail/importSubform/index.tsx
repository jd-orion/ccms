import React from "react";
import { DetailImportSubformField } from "ccms";
import { IImportSubformField } from "ccms/dist/src/components/detail/importSubform";
import { Display } from "ccms/dist/src/components/formFields/common";
import { IDetailItem } from "ccms/dist/src/steps/detail";
import { display as getALLComponents } from '../../formFields'
import InterfaceHelper from "../../../util/interface";
import { Form } from "antd";
import styles from './index.less'

export default class ImportSubformField extends DetailImportSubformField {
  getALLComponents = (type: any): typeof Display => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IImportSubformField) => {
    const {
      children
    } = props
    return (
      <div>
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
    const {
      key,
      label,
      visitable,
      fieldType,
      children
    } = props

    return (
      <Form.Item
        key={key}
        label={label}
        className={styles[`ccms-antd-mini-detail-${fieldType}`]}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }
}