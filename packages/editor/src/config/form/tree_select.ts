import { FieldConfigs } from 'ccms/dist/src/components/formFields';

const config: FieldConfigs[] = [
  {
    field: '',
    label: '展示配置',
    type: 'group',
    fields: [
      {
        field: 'mode',
        label: '展示形式',
        type: 'select_single',
        mode: 'button',
        options: {
          from: 'manual',
          data: [
            {
              value: 'tree',
              label: '树形',
            },
            {
              value: 'table',
              label: '表格',
            },
          ],
        },
      },
      {
        field: 'titleColumn',
        label: '表格列描述',
        type: 'text',
        condition: {
          template: "${type} === 'table'",
          params: [
            {
              field: 'type',
              data: {
                source: 'record',
                field: 'mode',
              },
            },
          ],
        },
      },
      {
        field: 'multiple.type',
        label: '复选形式',
        type: 'select_single',
        mode: 'button',
        options: {
          from: 'manual',
          data: [
            {
              value: 'array',
              label: '数组',
            },
            {
              value: 'split',
              label: '字符串分隔',
            },
          ],
        },
      },
      {
        field: 'multiple.split',
        label: '分隔符',
        type: 'text',
        condition: {
          template: "${type} === 'split'",
          params: [
            {
              field: 'type',
              data: {
                source: 'record',
                field: 'multiple.type',
              },
            },
          ],
        },
      },
      {
        "field": "multiple.valueType",
        "label": "选项值类型",
        "type": "select_single",
        "mode": "dropdown",
        "canClear": true,
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "string",
              "label": "字符串"
            },
            {
              "value": "number",
              "label": "数字"
            }
          ]
        },
        "condition": {
          "template": "${type} === 'split'",
          "params": [
            {
              "field": "type",
              "data": {
                "source": "record",
                "field": "multiple.type"
              }
            }
          ]
        }
      },
      {
        field: 'treeData',
        label: '选项',
        type: 'group',
        fields: [
          {
            field: 'from',
            label: '数据来源',
            type: 'select_single',
            mode: 'button',
            options: {
              from: 'manual',
              data: [
                {
                  value: 'manual',
                  label: '手动配置',
                },
                {
                  value: 'interface',
                  label: '接口下发',
                },
                {
                  value: 'automatic',
                  label: '已有数据',
                },
              ],
            },
          },
          {
            field: 'data',
            label: '选项数据',
            type: 'form',
            primaryField: 'title',
            canInsert: true,
            canRemove: true,
            canSort: true,
            canCollapse: true,
            fields: [
              {
                field: '',
                label: '',
                type: 'import_subform',
                interface: {
                  url: "${configDomain}/form/tree_select_options.json",
                  urlParams: [
                    {
                      field: 'version',
                      data: {
                        source: 'source',
                        field: 'version',
                      },
                    },
                    {
                      "field": "configDomain",
                      data: {
                        "source": "source",
                        "field": "configDomain"
                      },
                    },
                  ],
                  method: 'GET',
                  cache: {
                    global: 'CCMS_CONFIG_form_tree_select_options',
                  },
                },
              },
            ],
            condition: {
              template: "${from} === 'manual'",
              params: [
                {
                  field: 'from',
                  data: {
                    source: 'record',
                    field: 'from',
                  },
                },
              ],
            },
          },
          {
            field: 'interface',
            label: '接口配置',
            type: 'import_subform',
            interface: {
              url: "${configDomain}/common/InterfaceConfig.json",
              urlParams: [
                {
                  field: 'version',
                  data: {
                    source: 'source',
                    field: 'version',
                  },
                },
                {
                  "field": "configDomain",
                  data: {
                    "source": "source",
                    "field": "configDomain"
                  },
                },
              ],
              method: 'GET',
              cache: {
                global: 'CCMS_CONFIG_common_InterfaceConfig',
              },
            },
            condition: {
              template: "${from} === 'interface'",
              params: [
                {
                  field: 'from',
                  data: {
                    source: 'record',
                    field: 'from',
                  },
                },
              ],
            },
          },
          {
            field: 'sourceConfig',
            label: '选项数据',
            type: 'import_subform',
            interface: {
              url: "${configDomain}/common/ParamConfig.json",
              urlParams: [
                {
                  field: 'version',
                  data: {
                    source: 'source',
                    field: 'version',
                  },
                },
                {
                  "field": "configDomain",
                  data: {
                    "source": "source",
                    "field": "configDomain"
                  },
                },
              ],
              method: 'GET',
              cache: {
                global: 'CCMS_CONFIG_common_ParamConfig',
              },
            },
            condition: {
              template: "${from} === 'automatic'",
              params: [
                {
                  field: 'from',
                  data: {
                    source: 'record',
                    field: 'from',
                  },
                },
              ],
            },
          },
          {
            field: 'format.type',
            label: '数据格式',
            type: 'select_single',
            mode: 'button',
            options: {
              from: 'manual',
              data: [
                {
                  value: 'list',
                  label: '列表',
                },
              ],
            },
            condition: {
              template: "${from} === 'interface' || ${from} === 'automatic'",
              params: [
                {
                  field: 'from',
                  data: {
                    source: 'record',
                    field: 'from',
                  },
                },
              ],
            },
          },
          {
            field: 'format.keyField',
            label: '取值字段',
            type: 'text',
            condition: {
              template:
                "(${from} === 'automatic' || ${from} === 'interface') && ${type} === 'list'",
              params: [
                {
                  field: 'from',
                  data: {
                    source: 'record',
                    field: 'from',
                  },
                },
                {
                  field: 'type',
                  data: {
                    source: 'record',
                    field: 'format.type',
                  },
                },
              ],
            },
          },
          {
            field: 'format.titleField',
            label: '描述字段',
            type: 'text',
            condition: {
              template:
                "(${from} === 'automatic' || ${from} === 'interface') && ${type} === 'list'",
              params: [
                {
                  field: 'from',
                  data: {
                    source: 'record',
                    field: 'from',
                  },
                },
                {
                  field: 'type',
                  data: {
                    source: 'record',
                    field: 'format.type',
                  },
                },
              ],
            },
          },
          {
            field: 'format.childrenField',
            label: '子项字段',
            type: 'text',
            condition: {
              template:
                "(${from} === 'automatic' || ${from} === 'interface') && ${type} === 'list'",
              params: [
                {
                  field: 'from',
                  data: {
                    source: 'record',
                    field: 'from',
                  },
                },
                {
                  field: 'type',
                  data: {
                    source: 'record',
                    field: 'format.type',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
];

export default config;
