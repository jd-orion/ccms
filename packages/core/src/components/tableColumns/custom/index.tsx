import React, { RefObject } from 'react'
import Column, { ColumnConfig, ColumnProps, IColumn } from '../common'
import { loadMicroApp, MicroApp } from 'qiankun'
import moment from 'moment'
import { cloneDeep } from 'lodash'

export interface CustomColumnConfig extends ColumnConfig {
  type: 'custom'
  entry: string
}

export default class CustomColumn extends Column<CustomColumnConfig, {}, any> implements IColumn<any> {
  identifier: string = ''
  entry: string = ''
  container: RefObject<HTMLDivElement> = React.createRef()
  customColumn: MicroApp | null = null

  componentDidMount () {
    this.loadCustomColumn(this.props.config.entry)
  }

  getSnapshotBeforeUpdate () {
    const snapshot: string[] = []
    if (this.entry !== this.props.config.entry) {
      snapshot.push('entry')
    }
    return snapshot
  }

  componentDidUpdate (_: ColumnProps<CustomColumnConfig, any>, __: {}, snapshot: string[]) {
    if (snapshot.includes('entry')) {
      this.loadCustomColumn(this.props.config.entry)
    } else {
      if (this.customColumn && this.customColumn.update) {
        this.customColumn.update({
          value: this.props.value,
          record: this.props.record,
          data: cloneDeep(this.props.data),
          step: this.props.step,
          config: this.props.config,
          table: this.props.table,
          base: this.props.baseRoute,
          loadDomain: this.props.loadDomain
        })
      }
    }
  }

  loadCustomColumn = (entry: string) => {
    if (this.container.current && entry) {
      this.entry = this.props.config.entry
      this.identifier = `custom|${moment().format('x')}|${Math.floor(Math.random() * 1000)}`
      this.customColumn = loadMicroApp({
        name: this.identifier,
        entry,
        container: this.container.current,
        props: {
          value: this.props.value,
          record: this.props.record,
          data: cloneDeep(this.props.data),
          step: this.props.step,
          config: this.props.config,
          table: this.props.table,
          base: this.props.baseRoute,
          loadDomain: this.props.loadDomain
        }
      })
    }
  }

  render = () => {
    return (
      <div ref={this.container}></div>
    )
  }
}
