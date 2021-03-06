import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "",
    "label": "字体配置",
    "type": "group",
    "fields": [
      {
        "field": "color",
        "label": "字体颜色",
        "type": "color"
      },
      {
        "field": "fontSize",
        "label": "字体大小",
        "type": "text"
      },
      {
        "field": "fontWeight",
        "label": "字体加粗",
        "type": "text"
      }
    ]
  },
  {
    "field": "",
    "label": "位置配置",
    "type": "group",
    "fields": [
      {
        "field": "position",
        "label": "定位方式",
        "type": "select_single",
        "mode": "button",
        "options": {
          "from": "manual",
          "data": [
            {
              "value": "absolute",
              "label": "固定位置"
            },
            {
              "value": "relative",
              "label": "自动"
            }
          ]
        }
      },
      {
        "field": "left",
        "label": "左",
        "type": "text"
      },
      {
        "field": "right",
        "label": "右",
        "type": "text"
      },
      {
        "field": "top",
        "label": "上",
        "type": "text"
      },
      {
        "field": "bottom",
        "label": "下",
        "type": "text"
      }
    ]
  },

]

export default config