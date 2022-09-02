import React from 'react'
import { Breadcrumb, BreadcrumbItemProps, Statistic, PageHeader, PageHeaderProps } from 'antd'
import 'antd/lib/breadcrumb/style'
import 'antd/lib/statistic/style'
import 'antd/lib/page-header/style'
import { HeaderStep } from 'ccms'
import { IBreadcurmbItemProps, IBreadcurmbProps, IHeaderProps, IStatisticProps } from 'ccms/dist/steps/header'
import './index.less'
import InterfaceHelper from '../../util/interface'
import OperationHelper from '../../util/operation'
import DetailStep from '../detail'

export default class HeaderStepComponent extends HeaderStep {
  interfaceHelper = new InterfaceHelper()

  OperationHelper = OperationHelper

  DetailStep = DetailStep

  /**
   * 用于展示面包屑元素
   * @param props
   * @returns
   */
  renderBreadcurmbItemComponent = (props: IBreadcurmbItemProps) => {
    const breadcrumbItemProps: BreadcrumbItemProps = {}
    if (props.type === 'bold') {
      breadcrumbItemProps.className = 'breadcrumb-item-bold'
    }
    if (props.onClick) {
      breadcrumbItemProps.className = breadcrumbItemProps.className
        ? `${breadcrumbItemProps.className} breadcrumb-item-pointer`
        : 'breadcrumb-item-pointer'
      breadcrumbItemProps.onClick = props.onClick
    }
    return <Breadcrumb.Item {...breadcrumbItemProps}>{props.label}</Breadcrumb.Item>
  }

  /**
   * 用于展示面包屑
   * @param props
   * @returns
   */
  renderBreadcurmbComponent = (props: IBreadcurmbProps) => {
    return <Breadcrumb separator={props.separator}>{props.items}</Breadcrumb>
  }

  /**
   * 用于展示统计内容
   * @param props
   * @returns
   */
  renderStatisticComponent = (props: IStatisticProps) => {
    return <Statistic title={props.label} value={props.value} />
  }

  renderContent = (mainContent?: React.ReactNode, extraContent?: React.ReactNode) => {
    if (mainContent || extraContent) {
      if (mainContent && extraContent) {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{mainContent}</div>
            <div>{extraContent}</div>
          </div>
        )
      } else if (mainContent) {
        return mainContent
      } else if (extraContent) {
        return extraContent
      }
    } else {
      return null
    }
  }

  renderComponent = (props: IHeaderProps) => {
    const pageHeaderProps: PageHeaderProps = {
      className: 'ccms-antd-header'
    }
    if (props.breadcrumb) {
      pageHeaderProps.breadcrumbRender = () => props.breadcrumb
    }
    if (props.title) {
      pageHeaderProps.title = props.title
    }
    if (props.subTitle) {
      pageHeaderProps.subTitle = props.subTitle
    }
    if (props.onBack) {
      pageHeaderProps.onBack = props.onBack
    }

    return <PageHeader {...pageHeaderProps}>{this.renderContent(props.mainContent, props.extraContent)}</PageHeader>
  }
}
