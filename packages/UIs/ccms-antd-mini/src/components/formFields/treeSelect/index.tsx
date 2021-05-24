import React from "react";
import { TreeSelectField } from 'ccms';
import { ITreeSelectField, TreeSelectFieldConfig } from "ccms/dist/src/components/formFields/treeSelect";
import { TreeSelect } from 'antd';
export const PropsType = (props: TreeSelectFieldConfig) => { };

export default class TreeSelectComponent extends TreeSelectField {
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