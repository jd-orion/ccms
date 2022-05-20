import React from 'react'
import { componentType } from '.'
import { CCMSConfig, PageListItem } from '../../main'

export interface ColumnConfig extends componentType {
  field: string
  label: string
  align: 'left' | 'center' | 'right'
  defaultValue?: string
  style?: {
    color?: string
    fontSize?: number
    prefix?: string
    postfix?: string
    customStyle?: object
  }
}

/**
 * 表格项项子类需实现的方法
 * - get:      表格项获取展示值
 */
export interface IColumn<T> {
  getValue: () => T
}

export interface ColumnProps<T, V = any> {
  ref: (instance: Column<T, any> | null) => void
  record: { [field: string]: any }
  value: V
  data: any[]
  step: { [field: string]: any }
  config: T
  // 挂载引用
  table?: React.ReactNode
  baseRoute: string
  onUnmount: (reload?: boolean, data?: any) => Promise<void>
  checkPageAuth: (pageID: any) => Promise<boolean>
  loadPageURL: (pageID: any) => Promise<string>
  loadPageConfig: (pageID: any) => Promise<CCMSConfig>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
  loadPageFrameURL: (pageID: any) => Promise<string>
  loadPageList: () => Promise<Array<PageListItem>>
  loadDomain: (domain: string) => Promise<string>
}

interface ColumnState {}

export default class Column<T, E, V = any>
  extends React.Component<ColumnProps<T, V>, ColumnState>
  implements IColumn<V>
{
  constructor(props: ColumnProps<T>) {
    super(props)
    this.state = {}
  }

  static defaultProps = {
    config: {}
  }

  getValue = () => {
    return this.props.value
  }

  renderComponent = (props: E) => {
    return <>您当前使用的UI版本没有实现Column组件。</>
  }

  render() {
    return <></>
  }
}
