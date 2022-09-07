import { PageListItem } from "ccms/dist/main"

const sourcePageList: PageListItem[] = [
  {
    key: 1,
    value: 1,
    title: '页面'
  },
  {
    key: 2,
    value: 2,
    title: '目录',
    children: [
      {
        key: 3,
        value: 3,
        title: '子页面1'
      },
      {
        key: 4,
        value: 4,
        title: '子页面2'
      }
    ]
  }
]

export default sourcePageList