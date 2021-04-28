import React from "react";
import { RadioField } from 'ccms';
import { Radio } from "antd";
import "antd/lib/input/style/index.css"
import { IRadioField } from "ccms/dist/src/components/formFields/radio";

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