/*
 * @Author: your name
 * @Date: 2022-04-15 19:01:16
 * @LastEditTime: 2022-04-15 20:16:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEpre
 * @FilePath: /oconsole-web-ccms-config/src/config/detail/image.ts
 */

import { FieldConfigs } from "ccms/dist/src/components/formFields";

const config: FieldConfigs[] = [
  {
    "field": "width",
    "type": "number",
    "label": "图片宽度"
  },
  {
    "field": "height",
    "type": "number",
    "label": "图片高度"
  },
  // 待启用
  // {
  //   "field": "preview",
  //   "type": "switch",
  //   "label": "预览图片"
  // }
]

export default config