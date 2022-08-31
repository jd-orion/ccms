import React from 'react'
import { Button, Row, Col, Space, Typography, Collapse } from 'antd'
const { Title } = Typography;
const { Panel } = Collapse;
import { FormProps } from 'antd/lib/form'
import { DetailStep } from 'ccms'
import { IDetail, IDetailItem, DetailConfig } from 'ccms/dist/steps/detail'

import getALLComponents from '../../components/detail'
import style from "./index.less"
import { computedItemStyle } from '../../components/detail/common'
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
    const gap = Number(columns?.gap || 0)
    return (
      <div
        style={{
          rowGap: `${gap * 2}px`
        }}
        className={style['ccms-antd-mini-detail-row']}
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

  renderItemComponent = (props: IDetailItem) => {
    const {
      key,
      layout,
      styles,
      label,
      columns,
      collapsible,
      fieldType,
      children
    } = props

    const colStyle = computedItemStyle(columns, layout)

    return (
      <div
        style={Object.assign(colStyle, styles)}
        key={key}
        className={
          [
            style['detail-col'],
            style[`detail-col-${fieldType}`],
            style[`detail-col-${columns?.type || 'span'}`]
          ].join(' ')
        }
      >
        {
          fieldType === 'group' ? this.renderGroupUI(label, children) :
            <div className={style['detail-group-content']}>
              <div className={style[`detail-${fieldType}-title`]}>{label}</div>
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
        <div className={style['detail-group-content']}>
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