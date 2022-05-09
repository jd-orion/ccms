<div align="center">
    <img width="380" style="padding:10px 20px;" src="https://img13.360buyimg.com/imagetools/jfs/t1/194413/17/21815/10950/62442cb8Eabdd69af/3fab4136c307f89b.png">

![](https://img.shields.io/badge/license-MIT-blue) 
</div>
<hr/>
配置化自动生成中后台（CMS）页面。CCMS是一套完善、通用的可配置化的方案，提供丰富的CMS后台管理系统的JSON配置项，通过JSON自动生成后台管理系统页面，实现零代码生成后台管理前端页面。  

[文档](https://oriondoc.jd.com/) 
<!-- [CCMS使用](http://ccms-home-5395.preview-pf.jd.com/docs) | -->
<!-- [配置化编辑器](http://ccms-home-5395.preview-pf.jd.com/editor)   -->
<hr/>

# ✨  特点
- 🛠️ 配置生成CMS后台管理页面
- 📚 通过步骤设计覆盖不同后台业务应用场景
- 🏹 跨页面数据传输、跨组件交互
- 🎏 支持引入不同react组件库

## 工作原理
通过代理组件的属性定义、数据请求、跨组件交互和状态机判断，实现基于组件化的前端页面配置化。

## 便捷使用
通过配置JSON，定义表单步骤与组件。生成完整的后台管理系统页面与交互。

# 📦 使用
### ccms-editor使用
```
npm install ccms-editor --save
```
[配置化编辑器使用](https://www.npmjs.com/package/ccms-editor)
### ccms使用
```
npm install ccms ccms-antd --save
```

[CCMS使用](https://www.npmjs.com/package/ccms) 
# 📔  开发指南
以下是参与开发 ccms 相关文档，使用请看使用文档。
需要保证 Node.js 版本大于 12，将仓库 clone 到本地，并运行以下命令：

```sh
# 安装根目录依赖
npm install

# 安装packages各依赖
npm run lerna

# 链接各包
npm run link

#打包所有的包
npm run build

#启动editor
npm run dev

```
## packages目录结构

```tree
packages
├── core
├── editor
├── UIs
    ├── ccms-antd
    ├── ccms-antd-mini
```
### editor

CCMS-Editor通过配置化自动生成中后台（CMS）界面。

### core

配置化搭建引擎核心库。

### UIs

UI层，通过核心库的配置化文件支持引入不同UI组件库。

# 📖 API文档
👉 [Api文档]

[Api文档]:https://oriondoc.jd.com/



