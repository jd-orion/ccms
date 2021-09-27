import React from "react";
import { TreeSelectField } from 'ccms';
import { ITreeSelectField, TreeSelectFieldConfig } from "ccms/dist/src/components/formFields/treeSelect";
import { TreeSelect } from 'antd';
import InterfaceHelper from "../../../util/interface";

export default class TreeSelectComponent extends TreeSelectField {
  interfaceHelper = new InterfaceHelper()
  
  renderComponent = (props: ITreeSelectField) => {
    const {
      treeData,
      value,
      onChange
    } = props

    return (
      <div>
        <TreeSelect
          style={{ width: '100%' }}
          value={value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          treeDefaultExpandAll
          onChange={onChange}
        />
      </div>
    )
  }
}