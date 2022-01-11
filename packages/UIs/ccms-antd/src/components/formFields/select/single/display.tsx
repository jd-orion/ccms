/*
 * @Author: your name
 * @Date: 2022-01-05 20:40:12
 * @LastEditTime: 2022-01-07 11:04:41
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /ccms-antd-mini/Users/zhenjintao1/work/code/ccms-antd/src/components/formFields/select/single/display.tsx
 */
import React from 'react'
import { SelectSingleDisplay } from 'ccms'
import { ISelectSingleField } from 'ccms/dist/src/components/formFields/select/single/display'
import { ISelectFieldOption } from 'ccms/dist/src/components/formFields/select/common'

export default class SelectSingleDisplayComponent extends SelectSingleDisplay {
  renderSelectSingleComponent = (props: ISelectSingleField) => {
    const {
      value,
      options
    } = props
    return <React.Fragment>
      {
        options.find((item: ISelectFieldOption) => item.value === value)?.label
      }
    </React.Fragment>
  }
}
