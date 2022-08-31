import React from 'react'
import { RadioField } from 'ccms'
import { Radio } from 'antd'
import { IRadioField } from 'ccms/dist/components/formFields/radio'

export const PropsType = (props: IRadioField) => { }

export default class RadioFieldComponent extends RadioField {
    renderComponent = (props: IRadioField) => {
      const {
        value,
        options,
        onChange
      } = props

      return (
            <Radio.Group
                value={value}
                onChange={async (e) => {
                  await onChange(e.target.value)
                }}>
                {
                    options && options.length > 0 && options.map((item: { name: React.ReactNode; }, index: string | number | null | undefined) => {
                      return <Radio value={item.name} key={index}>{item.name}</Radio>
                    })
                }
            </Radio.Group>
      )
    }
}
