import React, { RefObject } from 'react'
import { loadMicroApp, MicroApp } from 'qiankun'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import Column, { ColumnConfig, ColumnProps, IColumn } from '../common'

export interface CustomColumnConfig extends ColumnConfig {
  type: 'custom'
  entry: string
  component?: {
    name: string
    version: string
  }
  customDefault?: any
}

export default class CustomColumn extends Column<CustomColumnConfig, {}, any> implements IColumn<any> {
  identifier = ''

  entry = ''

  container: RefObject<HTMLDivElement> = React.createRef()

  customColumn: MicroApp | null = null

  componentDidMount() {
    const entry = this.getEntry()
    this.loadCustomColumn(entry)
  }

  getSnapshotBeforeUpdate() {
    const snapshot: string[] = []
    if (this.getEntry() !== this.props.config.entry) {
      snapshot.push('entry')
    }
    return snapshot
  }

  getEntry() {
    const { entry, component } = this.props.config
    let componentUrl = ''
    if (component && this.props.loadCustomSource) {
      const url = this.props.loadCustomSource(component.name, component.version)
      componentUrl = `${url}index.html`
    }
    this.entry = entry || componentUrl
    return this.entry
  }

  componentDidUpdate(_: ColumnProps<CustomColumnConfig, any>, __: {}, snapshot: string[]) {
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
    return <div ref={this.container} />
  }
}
