import React from 'react'
import { Field, FieldConfig, IField } from '../common'

export interface HiddenFieldConfig extends FieldConfig {
  type: 'hidden'
}

export default class NumberField extends Field<HiddenFieldConfig, unknown, unknown> implements IField<unknown> {
  reset: () => Promise<unknown> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return undefined
    }
    return defaults
  }

  render = () => {
    return <></>
  }
}
