import React, { Key } from 'react'
import { TreeSelectField } from 'ccms'
import { Table, Tree, TreeSelect } from 'antd'
import { ITreeSelectField } from 'ccms/dist/src/components/formFields/treeSelect'
import InterfaceHelper from '../../../util/interface'
export default class TreeSelectFieldComponent extends TreeSelectField {
  interfaceHelper = new InterfaceHelper()

  //树选择treeselect
  renderComponent = (props: ITreeSelectField) => {
    const {
      multiple,
      treeData,
      value,
      onChange
    } = props

    return (
      <div>
        <TreeSelect
          multiple={multiple}
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

  // 树形控件
  renderTreeComponent = (props: ITreeSelectField): React.ReactElement => {
    const {
      value,
      treeData,
      onChange,
    } = props
    return <Tree
      checkable
      onCheck={(checked) => {
        onChange(checked as Array<string | number>);
      }}
      checkedKeys={value as Array<string | number>}
      treeData={treeData}
    />
  }

  // 树形表格控件
  renderTableComponent = (props: ITreeSelectField): React.ReactElement => {
    const {
      value,
      treeData,
      titleColumn,
      onChange,
    } = props

    return <Table
      rowKey="value"
      pagination={false}
      columns={[{
        title: titleColumn,
        dataIndex: "title",
        key: "title"
      }]}
      rowSelection={{
        checkStrictly: false,
        onChange: (selectedRowKeys) => {
          onChange(selectedRowKeys)
        },
        selectedRowKeys: value as Array<string | number> || []
      }}
      dataSource={treeData}
    />
  }
}
