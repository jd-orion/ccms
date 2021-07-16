import React from 'react'
import { DescField } from 'ccms'
import { IDescField, DescFieldConfig } from 'ccms/dist/src/components/formFields/description'

export const PropsType = (props: DescFieldConfig) => { }

export default class DescFieldComponent extends DescField {
  renderComponent = (props: IDescField) => {
    const {
      desc,
      link,
      style
    } = props
    console.log(desc)
    return (
      <div style={{ ...style }}>
        {link
          ? <a href={link}>
            {desc}
          </a>
          : desc
        }
      </div>
    )
  }
}
