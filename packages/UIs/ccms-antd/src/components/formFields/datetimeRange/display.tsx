import React from 'react'
import { DatetimeRangeDisplay } from 'ccms'
import { IDatetimeRangeField } from 'ccms/dist/components/formFields/datetimeRange/display'
import { SwapRightOutlined } from "@ant-design/icons"

export default class DatetimeRangeDisplayComponent extends DatetimeRangeDisplay {
  renderComponent = (props: IDatetimeRangeField) => {
    const {
      value,
      format
    } = props
    
    return (
      <React.Fragment>
        {value ? value[0] ? `${value[0].format(format)} ` : '' : ''}
        {value ? value[0] ? <SwapRightOutlined/> : '' : ''}
        {value ? value[1] ? ` ${value[1].format(format)}` : '' : ''}
      </React.Fragment>
    )
  }
}
