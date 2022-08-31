import React from 'react'
import { DetailGroupField } from 'ccms'
import { IGroupField, GroupFieldConfig } from 'ccms/dist/components/detail/group'
import { IDetailItem } from 'ccms/dist/steps/detail'
import { Col, Row } from 'antd'
import getALLComponents from '..'
import styles from './index.less'
import { computedItemStyle, computedGapStyle } from '../common'

export const PropsType = (props: GroupFieldConfig) => {}

export default class GroupFieldComponent extends DetailGroupField {
  getALLComponents = (type: any) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
    const { children, columns } = props
    const gap = computedGapStyle(columns, 'row')
    return (
      <div
        style={{
          ...gap
        }}
        className={styles['ccms-antd-mini-detail-group-row']}
      >
        {children}
      </div>
    )
  }

  renderItemComponent = (props: IDetailItem) => {
    const { layout, label, styles: itemstyle, columns, fieldType, children } = props
    const colStyle = computedItemStyle(columns, layout)

    return (
      <div style={colStyle} className={[styles['detail-group-col'], styles[`ccms-antd-mini-detail-gruop`]].join(' ')}>
        <div className={styles['detail-group-content']}>
          <div className={styles[`ccms-antd-mini-detail-gruop-title`]}>{label}</div>
          <div className={styles['detail-group-children']} style={itemstyle}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
