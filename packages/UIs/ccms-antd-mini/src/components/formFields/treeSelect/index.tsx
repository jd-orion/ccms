import React from 'react'
import { TreeSelectField } from 'ccms'
import { ITreeSelectField } from 'ccms/dist/components/formFields/treeSelect'
import { TreeSelect } from 'antd'
import 'antd/lib/tree-select/style'
import InterfaceHelper from '../../../util/interface'

export default class TreeSelectComponent extends TreeSelectField {
  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: ITreeSelectField) => {
    const { treeData, value, onChange } = props

    return (
      <div>
        <TreeSelect
          showSearch
          treeNodeFilterProp="title"
          style={{ width: '100%' }}
          value={value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          treeDefaultExpandAll
          onChange={onChange}
          getPopupContainer={(ele) => ele.parentElement || document.body}
        />
      </div>
    )
  }
}
