import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "format",
    "label": "格式",
    "type": "text",
    "defaultValue": {
      "source": "static",
      "value": "YYYY-MM-DD HH:mm:ss"
    }
  }
]

export default config