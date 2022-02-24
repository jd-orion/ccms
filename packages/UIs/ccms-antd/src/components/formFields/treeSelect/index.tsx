/*
 * @Author: zjt
 * @Date: 2022-02-21 21:19:29
 * @LastEditTime: 2022-02-23 20:57:07
 * @LastEditors: zjt
 * @Description: 树形选框
 */
import React, { Key } from 'react'
import { TreeSelectField } from 'ccms'
import { Table, Tree } from 'antd'
import { ITreeSelectField } from 'ccms/src/components/formFields/treeSelect'
import InterfaceHelper from '../../../util/interface'
export default class TreeSelectFieldComponent extends TreeSelectField {
  interfaceHelper = new InterfaceHelper()

  renderTreeComponent = (props: ITreeSelectField): React.ReactElement => {
    const {
      value,
      treeData,
      onChange,
    } = props
    return <Tree
      checkable
      onCheck={(checked: Key[] | { checked: Key[]; halfChecked: Key[]; }) => {
        console.log("onCheck", checked);
        onChange(checked as string | (string | number)[]);
      }}
      checkedKeys={value}
      treeData={treeData}
    />
  }

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
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          console.log('typeof', typeof selectedRowKeys, selectedRowKeys)
          onChange(selectedRowKeys)
        },
        selectedRowKeys: value || []
      }}
      dataSource={treeData}
    />
  }
}
