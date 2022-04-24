/**
 * @file commitlint 配置
 * commit message: <type>(<scope>): <subject>(注意冒号后面有空格)
 * type 标识commit类别
 * scope 标识commit影响范围
 * subject 本次修改的简单描述
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'init', // 初始提交
        'feat', // 新功能（feature）
        'perf', // 优化
        'fix', // 修补bug
        'docs', // 文档
        'style', // 格式
        'refactor', // 重构
        'build', // 编译构建
        'test', // 增加测试
        'revert', // 回滚
        'chore' // 其他改动
      ]
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
}
