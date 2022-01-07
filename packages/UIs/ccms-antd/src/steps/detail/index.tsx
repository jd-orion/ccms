import React from 'react'
import { Button, Row, Col, Space, Typography, Collapse } from 'antd'
const { Title } = Typography;
const { Panel } = Collapse;
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
      columns,
      onBack,
      backText,
      children
    } = props
    const gutter = Number(columns?.gutter || 0)
    console.log(gutter, 'gutter', columns?.gutter)
    return (
      <div
        style={{
          rowGap: `${gutter * 2}px`,
          // marginLeft: `-${gutter / 2}px`,
          // marginRight: `-${gutter / 2}px`
        }}
        className={styles['ccms-antd-mini-detail-row']}
      >
        {children}
        {
          onBack && <Col span={24}>
            <Space>
              {<Button onClick={() => onBack()}>{backText || '返回'}</Button>}
            </Space>
          </Col>
        }
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
    if (layout === 'horizontal') {
      Object.assign(setStyle, {
        flexDirection: 'column'
      })
    }

    return setStyle
  }


  renderItemComponent = (props: IDetailItem) => {
    const {
      key,
      layout,
      label,
      columns,
      collapsible,
      fieldType,
      children
    } = props

    const colStyle = this.computedStyle(columns, layout)

    return (
      <div
        style={colStyle}
        key={key}
        className={
          [
            styles['detail-col'],
            styles[`detail-col-${fieldType}`],
            styles[`detail-col-${columns?.type || 'span'}`]
          ].join(' ')
        }
      >
        {
          fieldType === 'group' ? this.renderGroupUI(label, children) :
            <div className={styles['detail-group-content']}>
              <div className={styles[`detail-${fieldType}-title`]}><span className={styles['down-arrow']} />{label}</div>
              {children}
            </div>
        }
      </div >
    )
  }

  // group UI
  renderGroupUI = (label: string, children: any, collapsible?: 'header' | 'disabled') => {
    return <Collapse collapsible="header" defaultActiveKey={['1']} >
      <Panel header={label} key="1" collapsible={collapsible || 'header'}>
        <div className={styles['detail-group-content']}>
          {children}
        </div>
      </Panel>
    </Collapse>
  }

  // title UI
  renderTitleUI = (label: string, level: 5 | 1 | 2 | 3 | 4 | undefined) => {
    return <Title level={level}>{label}</Title>
  }
}
// <FormConfig, IForm>
export const PropsType = (props: IDetail) => { };

export const PropsTypeFormConfig = (props: DetailConfig) => { };
export const PropsTypeStep = (props: DetailStep) => { };