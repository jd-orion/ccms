import React, { RefObject } from 'react'
import { Field, FieldConfig, IField, FieldInterface, FieldProps } from '../common'
import { loadMicroApp, MicroApp } from 'qiankun'
import moment from 'moment'
import { getValue } from '../../../util/value'
import { cloneDeep } from 'lodash'

export interface CustomFieldConfig extends FieldConfig, FieldInterface {
  type: 'custom'
  entry: string
}

export default class CustomField extends Field<CustomFieldConfig, {}, any> implements IField<any> {
  identifier: string = ''
  entry: string = ''
  container: RefObject<HTMLDivElement> = React.createRef()
  customField: MicroApp | null = null

  componentDidMount () {
    this.loadCustomField(this.props.config.entry)
  }

  getSnapshotBeforeUpdate() {
    const snapshot: string[] = []
    if (this.entry !== this.props.config.entry) {
      snapshot.push('entry')
    }
    return snapshot
  }

  componentDidUpdate (_: FieldProps<CustomFieldConfig, any>, __: {}, snapshot: string[]) {
    if (snapshot.includes('entry')) {
      this.loadCustomField(this.props.config.entry)
    } else {
      if (this.customField && this.customField.update) {
        this.customField.update({
          value: getValue(this.props.value, this.props.config.field),
          record: this.props.record,
          data: cloneDeep(this.props.data),
          step: this.props.step,
          config: this.props.config,
          onChange: this.props.onChange,
          onValueSet: this.props.onValueSet,
          onValueUnset: this.props.onValueUnset,
          onValueListAppend: this.props.onValueListAppend,
          onValueListSplice: this.props.onValueListSplice,
          base: this.props.baseRoute,
          loadDomain: this.props.loadDomain
        });
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
          value: getValue(this.props.value, this.props.config.field),
          record: this.props.record,
          data: cloneDeep(this.props.data),
          step: this.props.step,
          config: this.props.config,
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
