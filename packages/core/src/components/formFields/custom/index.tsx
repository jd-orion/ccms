import React, { RefObject } from 'react'
import { loadMicroApp, MicroApp } from 'qiankun'
import moment from 'moment'
import { Field, FieldConfig, IField, FieldInterface, FieldProps, FieldError } from '../common'
// import { cloneDeep } from 'lodash'

export interface CustomFieldConfig extends FieldConfig, FieldInterface {
  type: 'custom'
  entry: string
  component?: {
    name: string
    version: string
  }
  customDefault?: any
}

export default class CustomField extends Field<CustomFieldConfig, {}, any> implements IField<any> {
  identifier = ''

  entry = ''

  container: RefObject<HTMLDivElement> = React.createRef()

  customField: MicroApp | null = null

  _validate: (value: string) => Promise<true | FieldError[]> = async () => true

  _get: () => Promise<any> = async () => this.props.value

  componentDidMount() {
    const entry = this.getEntry()
    this.loadCustomField(entry)
  }

  getSnapshotBeforeUpdate() {
    const snapshot: string[] = []
    if (this.props.config.entry !== this.getEntry()) {
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

  validate = async (value: any): Promise<true | FieldError[]> => {
    return await this._validate(value)
  }

  get = async (): Promise<any> => {
    return await this._get()
  }

  bindValidate = (validate: (value: string) => Promise<true | FieldError[]>) => {
    this._validate = validate
  }

  bindGet = async (get: () => Promise<any>): Promise<any> => {
    this._get = get
  }

  componentDidUpdate(_: FieldProps<CustomFieldConfig, any>, __: {}, snapshot: string[]) {
    if (snapshot.includes('entry')) {
      const { entry } = this.props.config
      this.loadCustomField(entry)
    } else {
      if (this.customField && this.customField.update) {
        this.customField.update({
          value: this.props.value,
          record: this.props.record,
          data: this.props.data,
          form: this.props.form,
          step: this.props.step,
          config: this.props.config,
          onChange: this.props.onChange,
          onValueSet: this.props.onValueSet,
          onValueUnset: this.props.onValueUnset,
          onValueListAppend: this.props.onValueListAppend,
          onValueListSplice: this.props.onValueListSplice,
          base: this.props.baseRoute,
          loadDomain: this.props.loadDomain,
          loadPageList: this.props.loadPageList,
          bindValidate: this.bindValidate,
          bindGet: this.bindGet
        })
      }
    }
  }

  loadCustomField = (entry: string) => {
    if (this.container.current && entry) {
      this.entry = this.getEntry()
      this.identifier = `custom|${moment().format('x')}|${Math.floor(Math.random() * 1000)}`
      this.customField = loadMicroApp({
        name: this.identifier,
        entry,
        container: this.container.current,
        props: {
          value: this.props.value,
          record: this.props.record,
          data: this.props.data,
          form: this.props.form,
          step: this.props.step,
          config: this.props.config,
          onChange: this.props.onChange,
          onValueSet: this.props.onValueSet,
          onValueUnset: this.props.onValueUnset,
          onValueListAppend: this.props.onValueListAppend,
          onValueListSplice: this.props.onValueListSplice,
          base: this.props.baseRoute,
          loadDomain: this.props.loadDomain,
          loadPageList: this.props.loadPageList,
          bindValidate: this.bindValidate,
          bindGet: this.bindGet
        }
      })
    }
  }

  render = () => {
    return <div ref={this.container} />
  }
}
