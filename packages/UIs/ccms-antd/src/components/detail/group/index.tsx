import React from "react";
import { DetailGroupField } from 'ccms';
import { IGroupField, GroupFieldConfig } from "ccms/dist/src/components/detail/group";
import { IDetailItem } from "ccms/dist/src/steps/detail";
import { Col, Row } from "antd"
import getALLComponents from '../'
import styles from './index.less'
import { formItemLayout } from "../common";

export const PropsType = (props: GroupFieldConfig) => { };

export default class GroupFieldComponent extends DetailGroupField {
  getALLComponents = (type: any) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
    const {
      children,
      columns
    } = props
    const gutter = Number(columns?.gutter || 0)
    return (
      <div
        style={{
          rowGap: `${gutter}px`,
          marginLeft: `-${gutter / 2}px`,
          marginRight: `-${gutter / 2}px`
        }}
        className={styles['ccms-antd-mini-detail-group-row']}>
        {children}
      </div>
    )
  }


  computedStyle = (columns: any, layout: string) => {
    const setStyle = {}
    if (!columns) return {}
    Object.assign(setStyle,
      columns.gutter ? {
        paddingLeft: `${columns.gutter / 2}px`,
        paddingRight: `${columns.gutter / 2}px`,
      } : {})
    if (columns.type === 'span') {
      Object.assign(setStyle, {
        flex: `0 0 ${(100 / columns.value)}%`,
        maxWidth: `${(100 / columns.value)}%`,
      })
    }
    if (columns.type === 'width') {
      Object.assign(setStyle, {
        flex: `0 0 ${columns.value}`,
        maxWidth: columns.value,
      })
    }

    return setStyle
  }

  renderItemComponent = (props: IDetailItem) => {
    const {
      layout,
      label,
      columns,
      fieldType,
      children
    } = props
    const colStyle = this.computedStyle(columns, layout)
    console.log(colStyle, 'colstyle')
    return (
      <div
        style={colStyle}
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