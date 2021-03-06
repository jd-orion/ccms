import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "",
    "label": "展示配置",
    "type": "group",
    "fields": [
      {
        "field": "format",
        "label": "展示格式",
        "type": "text"
      },
      {
        "field": "submitFormat",
        "label": "提交格式",
        "type": "text"
      },
      {
        "field": "mode",
        "label": "选框形式",
        "type": "select_single",
        "mode": "dropdown",
        "canClear": true,
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "time",
              "label": "时间"
            },
            {
              "value": "date",
              "label": "日期"
            },
            {
              "value": "datetime",
              "label": "时间&日期"
            },
            {
              "value": "week",
              "label": "周"
            },
            {
              "value": "month",
              "label": "月份"
            },
            {
              "value": "quarter",
              "label": "季度"
            },
            {
              "value": "year",
              "label": "年份"
            }
          ]
        }
      },
      {
        "field": "placeholder",
        "label": "占位符",
        "type": "text"
      }
    ]
  },
  {
    "field": "",
    "label": "校验条件",
    "type": "group",
    "fields": [
      {
        "field": "regExp",
        "label": "正则校验",
        "type": "group",
        "fields": [
          {
            "field": "expression",
            "label": "正确表达式",
            "type": "text"
          },
          {
            "field": "message",
            "label": "错误提示语",
            "type": "text"
          }
        ]
      }
    ]
  }
]

export default config