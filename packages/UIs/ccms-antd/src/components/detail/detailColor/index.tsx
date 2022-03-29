import React from 'react'
import { DetailColorField } from 'ccms'
import { IColorProps, ColorDetailConfig } from 'ccms/dist/src/components/detail/detailColor'

export const PropsType = (props: ColorDetailConfig) => {}

export default class InfoDetailComponent extends DetailColorField {
  renderComponent = (props: IColorProps) => {
    
    const {
      value
    } = props

    return (
      <div>
        {(value && <span style={{width: "22px",height: "24px", border: "1px solid #d9d9d9", background: value, float: "left" , marginRight: "10px" }}></span>)}
        {(value && value )} 
      </div>
    )
  }
}
