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
    field: 'children',
    label: '子项',
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
  },
];

export default config;
