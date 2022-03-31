import { FieldConfigs } from 'ccms/dist/src/components/formFields';

const config: FieldConfigs[] = [
  {
    field: 'title',
    label: '描述',
    type: 'text',
  },
  {
    field: 'value',
    label: '值',
    type: 'any',
  },
  {
    field: 'options',
    label: '选项',
    type: 'group',
    fields: [
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '/ccms/config/${version}/${subversion}/common/EnumerationConfig.json',
          urlParams: [
            {
              field: 'version',
              data: {
                source: 'source',
                field: 'version',
              },
            },
            {
              field: 'subversion',
              data: {
                source: 'source',
                field: 'subversion',
              },
            },
          ],
          method: 'GET',
          cache: {
            global: 'CCMS_CONFIG_common_EnumerationConfig',
          },
        },
      },
    ],
  },
  {
    field: 'children',
    label: '子项',
    type: 'form',
    fields: [
      {
        field: '',
        label: '',
        type: 'import_subform',
        interface: {
          url: '/ccms/config/${version}/${subversion}/form/tree_select_options.json',
          urlParams: [
            {
              field: 'version',
              data: {
                source: 'source',
                field: 'version',
              },
            },
            {
              field: 'subversion',
              data: {
                source: 'source',
                field: 'subversion',
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
  },
];

export default config;
