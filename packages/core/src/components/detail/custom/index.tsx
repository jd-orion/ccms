import React, { RefObject } from 'react'
import { DetailField, DetailFieldConfig, DetailFieldProps, IDetailField } from '../common'
import { loadMicroApp, MicroApp } from 'qiankun'
import moment from 'moment'
import { cloneDeep } from 'lodash'

export interface CustomDetailConfig extends DetailFieldConfig {
  type: 'custom'
  entry: string
  component?: {
    name: string
    version: string
  }
  customDefault?: any
}

export default class CustomDtail extends DetailField<CustomDetailConfig, {}, any> implements IDetailField<any> {
  identifier: string = ''
  entry: string = ''
  container: RefObject<HTMLDivElement> = React.createRef()
  customField: MicroApp | null = null
  _get: () => Promise<any> = async () => this.props.value

  componentDidMount () {
    const entry = this.getEntry()
    this.loadCustomField(entry)
  }

  getSnapshotBeforeUpdate () {
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


  get = async (): Promise<any> => {
    return await this._get()
  }

  bindGet = async (get: () => Promise<any>): Promise<any> => {
    this._get = get
  }

  componentDidUpdate (_: DetailFieldProps<CustomDetailConfig, any>, __: {}, snapshot: string[]) {
    if (snapshot.includes('entry')) {
      this.loadCustomField(this.props.config.entry)
    } else {
      if (this.customField && this.customField.update) {
        this.customField.update({
          value: this.props.value,
          record: this.props.record,
          data: cloneDeep(this.props.data),
          step: this.props.step,
          config: this.props.config,
          detail: this.props.detail,
          onChange: this.props.onChange,
          onValueSet: this.props.onValueSet,
          onValueUnset: this.props.onValueUnset,
          onValueListAppend: this.props.onValueListAppend,
          onValueListSplice: this.props.onValueListSplice,
          base: this.props.baseRoute,
          loadDomain: this.props.loadDomain
        })
      }
    }
  }

  loadCustomField = (entry: string) => {
    if (this.container.current && entry) {
      this.entry = this.props.config.entry
      this.identifier = `custom|${moment().format('x')}|${Math.floor(Math.random() * 1000)}`
      this.customField = loadMicroApp({
        name: this.identifier,
        entry,
        container: this.container.current,
        props: {
          value: this.props.value,
          record: this.props.record,
          data: cloneDeep(this.props.data),
          step: this.props.step,
          config: this.props.config,
          detail: this.props.detail,
          onChange: this.props.onChange,
          onValueSet: this.props.onValueSet,
          onValueUnset: this.props.onValueUnset,
          onValueListAppend: this.props.onValueListAppend,
          onValueListSplice: this.props.onValueListSplice,
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
