import { FieldConfigs } from "ccms/dist/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "showLines",
    "type": "number",
    "label": "最大行数"
  },
  {
    "field": "showMore",
    "type": "switch",
    "label": "查看更多",
    "condition": {
      "template": "${showLines} > 0",
      "params": [
        {
          "field": "showLines",
          "data": {
            "source": "record",
            "field": "showLines"
          }
        }
      ]
    }
  },
  {
    "field": "linkUrl",
    "type": "switch",
    "label": "链接跳转"
  }
]

export default config