'use strict'
module.exports = {
  types: [
    { value: 'init', name: '初始化' },
    { value: 'feat', name: '新增: 新功能' },
    { value: 'fix', name: '修复: 修复一个Bug' },
    { value: 'docs', name: '文档: 变更的只有文档' },
    { value: 'style', name: '格式: 空格, 分号等格式修复' },
    { value: 'release', name: '发版: 更新版本号' },
    { value: 'refactor', name: '重构: 代码重构，注意和特性、修复区分开' },
    { value: 'perf', name: '性能: 提升性能' },
    { value: 'test', name: '测试: 添加一个测试' },
    { value: 'build', name: '工具: 开发工具变动(构建、脚手架工具等)' },
    { value: 'revert', name: '回滚: 代码回退' },
    { value: 'chore', name: '其他' }
  ],
  scopes: [{ name: 'javascript' }, { name: 'typescript' }, { name: 'React' }, { name: 'node' }],
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    customScope: 'Denote the SCOPE of this change:',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?(yes/no)'
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['特性', '修复'],
  subjectLimit: 100
}
