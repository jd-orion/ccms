import React from 'react'
import { componentType } from '.'

export interface ColumnConfig extends componentType {
  field: string
  label: string,
  defaultValue?: string,
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
  getValue: () => Promise<T>
}

export interface ColumnProps<T> {
  ref: (instance: Column<T, any> | null) => void
  record: { [field: string]: any }
  value: any
  data: any[],
  step: number,
  config: T
}

interface ColumnState {
}

export default class Column<T, E> extends React.Component<ColumnProps<T>, ColumnState> implements IColumn<T> {
  constructor (props: ColumnProps<T>) {
    super(props)
    this.state = {}
  }
  
  static defaultProps = {
    config: {}
  }

  getValue= ()=>{
    return this.props.value
  }

  renderComponent = (props: E) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现Column组件。
    </React.Fragment>
  }

  render = () => {
    return (<></>)
  }
}
