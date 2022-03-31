
## 开发

### 初始化工程

**需要首先初始化`ccms-core`与`ccms-*`UI工程！**

### 使用本地库调试
如packjson中有对应的线上库，先uninstall对应的库后npm link

```sh
npm install

# 根据需要演示的UI库版本设置，如`ccms-antd`
npm link ccms-core  ccms-antd ccms-antd-mini

sudo npm link
```

### 使用线上库调试

```sh
npm install

# 根据需要演示的UI库版本设置，如`ccms-antd`
npm install ccms-core  ccms-antd ccms-antd-mini

sudo npm link
```

### 调试

```sh
npm run dev
```

### 发布
详见：https://www.npmjs.com/package/@jd_orion/oconsole-cli

```
oconsole publish
```