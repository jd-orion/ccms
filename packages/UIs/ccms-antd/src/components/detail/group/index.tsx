import React from "react";
import { DetailGroupField } from 'ccms';
import { IGroupField, GroupFieldConfig } from "ccms/dist/src/components/detail/group";
import { IDetailItem } from "ccms/dist/src/steps/detail";
import { Col, Row } from "antd"
import getALLComponents from '../'
import styles from './index.less'
import { computedItemStyle, computedGutterStyle } from "../common";

export const PropsType = (props: GroupFieldConfig) => { };

export default class GroupFieldComponent extends DetailGroupField {
  getALLComponents = (type: any) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
    const {
      children,
      columns
    } = props
    const gutter = computedGutterStyle(Number(columns?.gutter || 0), 'row')
    return (
      <div
        style={{
          ...gutter
        }}
        className={styles['ccms-antd-mini-detail-group-row']}>
        {children}
      </div>
    )
  }

  renderItemComponent = (props: IDetailItem) => {
    const {
      layout,
      label,
      styles: itemstyle,
      columns,
      fieldType,
      children
    } = props
    const colStyle = computedItemStyle(columns, layout)
    console.log(colStyle, 'colstyle')
    return (
      <div
        style={Object.assign(colStyle,itemstyle)}
        className={[styles['detail-group-col'], styles[`ccms-antd-mini-detail-${fieldType}`]].join(' ')}
      >
        <div className={styles['detail-group-content']}>

          <div className={styles[`ccms-antd-mini-detail-${fieldType}-title`]}>{label}</div>
          <div>{children}</div>
        </div>
      </div>
    )
  }
}