import { Field, FieldConfig, IField } from "../common";

export interface HiddenFieldConfig extends FieldConfig {
  type: 'hidden'
}

export default class NumberField extends Field<HiddenFieldConfig, {}, any> implements IField<any> {
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return undefined
    } else {
      return defaults
    }
  }
}