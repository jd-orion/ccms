const fs = require("fs");
const crypto = require("crypto");
const lodash = require("lodash");
const path = require("path");
const process = require("process");
const child_process = require("child_process");
const spawnSync = child_process.spawnSync;
const { prompt } = require('enquirer');

// 强制刷新API开关：慎用！
const refreshAPI = false

const config = { children: [] }
const temp = []

// 生成属性配置项列表
const setConfig = async (fields, config, dependents = [], parent_progress = '') => {
  for (const index in fields) {
    const progress = `${parent_progress} ${Number(index) + 1}/${fields.length}`
    const field = fields[index]
    const field_path = field.field.split('.')
    let node = config
    for (const field_path_node of field_path) {
      if (field_path_node) {
        if (!node.children) node.children = []
        const exists = node.children.find((item) => item.field === field_path_node)
        if (exists) {
          node = exists
        } else {
          const new_node = { field: field_path_node, label: field.label }
          node.children.push(new_node)
          node = new_node
        }
      }
    }

    switch (field.type) {
      case 'import_subform':
        const subpath = field.interface.url.substring(37, field.interface.url.length - 5)

        if (!dependents.includes(subpath)) {
          if (!fs.existsSync(path.join(__dirname, `../src/config/${subpath}.js`))) {
            spawnSync("tsc", [`../src/config/${subpath}.ts`], {
              cwd: __dirname,
              shell: process.platform === 'win32'
            });
            if (fs.existsSync(path.join(__dirname, `../src/config/${subpath}.js`))) {
              temp.push(`../src/config/${subpath}.js`)
              const config = require(path.join(__dirname,`../src/config/${subpath}.js`));
              await setConfig(config.default, node, [subpath, ...dependents], progress)
            }
          } else {
            temp.push(`../src/config/${subpath}.js`)
            const config = require(path.join(__dirname,`../src/config/${subpath}.js`));
            await setConfig(config.default, node, [subpath, ...dependents], progress)
          }
        }

        break
      case 'form':
      case 'group':
      case 'tabs':
        await setConfig(field.fields, node, dependents, progress)
        break
    }
  }
}

// 生成API
const getTips = async (field, desc, description, choicesList, api) => {
  if (api) {
    choicesList.unshift(['上次填写', api])
  }
  const { type } = await prompt({
    type: 'select',
    name: 'type',
    message: `请输入字段 ${field} 的 ${desc}：${description.map((line) => `\n  ${line}`).join("")}\n`,
    choices: [
      { name: 1, message: '稍后填写' },
      { name: 2, message: '空' },
      { name: 3, message: '输入' },
      ...choicesList.map((choice, index) => ({ name: index + 100, message: `${choice[0]}：${choice[1]}` }))
    ]
  })
  if (type === 1) {
    return 'TODO'
  } else if (type === 2) {
    return ''
  } else if (type === 3) {
    const { text } = await prompt({
      type: 'input',
      name: 'text'
    })
    return text
  } else {
    return choicesList[type - 100]
  }
}
const getAPI = async (source, target = []) => {
  for (const field of source) {
    if (field.type === 'import_subform') {
      field.field = field.field === "" ? "*" : `${field.field}.*`
    }
    if (field.field.indexOf('.') >= 0) {
      const field_path = field.field.split('.')
      let container = target
      while(field_path.length > 1) {
        const path = field_path.shift()
        const exists = container.find((node) => node.field === path && node.type === 'path')
        if (exists) {
          container = exists.fields
        } else {
          const node = {
            field: path,
            label: field.label,
            type: 'path',
            fields: []
          }
          container.push(node)
          container = node.fields
        }
      }
      if (field.fields) {
        container.push({
          ...field,
          field: field_path.shift(),
          fields: await getAPI(field.fields, [])
        })
      } else {
        container.push({
          ...field,
          field: field_path.shift()
        })
      }
    } else if (field.fields) {
      target.push({
        ...field,
        fields: await getAPI(field.fields, [])
      })
    } else {
      target.push(field)
    }
  }
  return target
}
const setAPI = async (fields, apis, prefix = "") => {
  const items = []
  for (const field of fields) {
    const hash = crypto.createHash('md5').update(JSON.stringify(field)).digest('hex')

    // 配置项未更新时直接使用
    const apiHash = apis.find((api) => api.hash === hash)
    if (apiHash && !refreshAPI) {
      console.log(`字段 ${prefix}${field.field} 无改动。`)
      items.push(apiHash)
    } else {
      const item = {
        field: field.field,
        label: field.label,
        type: field.type,
        hash: crypto.createHash('md5').update(JSON.stringify(field)).digest('hex')
      }

      // 部分更新时
      const api = apis.find((api) => api.field === field.field)
  
      // Tips
      if (api && api.tips !== undefined && api.tips !== 'TODO' && !refreshAPI) {
        item.tips = api.tips
      } else {
        item.tips = await getTips(prefix + field.field, '备注', [], [['字段描述',field.label]], api && api.tips)
      }
  
      // Fields
      if (field.fields) {
        item.fields = await setAPI(field.fields, api && api.fields ? api.fields : [], `${prefix}${field.field}.`)
      }
  
      // Options
      if (field.options && field.options.from === "manual" && field.options.data) {
        item.options = []
        for (const option of field.options.data) {
          const optionHash = crypto.createHash('md5').update(JSON.stringify(option)).digest('hex')
          const optionAPI = api && api.options && api.options.find((option) => option.hash = optionHash)
          if (optionAPI && !refreshAPI) {
            item.options.push(optionAPI)
          } else {
            item.options.push({
              value: option.value,
              label: option.label,
              hash: optionHash,
              tips: await getTips(prefix + field.field, `选项 ${option.value}`, [], [['选项描述',option.label]], optionAPI && optionAPI.tips)
            })
          }
        }
      }
  
      // Condition
      if (field.condition) {
        const conditionHash = crypto.createHash('md5').update(JSON.stringify(field.condition)).digest('hex')
        const conditionAPI = api && api.condition && api.condition.hash === conditionHash
        if (conditionAPI && !refreshAPI) {
          item.condition = api.condition
        } else {
          item.condition = {
            hash: conditionHash,
            tips: await getTips(prefix + field.field, `展示条件`, JSON.stringify(field.condition, undefined, 2).split('\n'), [], api && api.condition && api.condition.tips)
          }
        }
      }
  
      // Common
      if (field.type === 'import_subform') {
        const interfaceHash = crypto.createHash('md5').update(JSON.stringify(field.interface)).digest('hex')
        if (api && api.common && api.common.hash === interfaceHash) {
          item.common = api.common
        } else {
          const info = field.interface.url.split('/')
          const category = info[5]
          const name = info[6].split('.')[0]
          item.common = {
            key: name,
            path: category + '/' + name,
            hash: interfaceHash
          }
        }
      }
  
      items.push(item)
    }
  }

  return items
}

// 主函数
const main = async () => {
  if (!fs.existsSync(path.join(__dirname, `./config_analysis`))) fs.mkdirSync(path.join(__dirname, `./config_analysis`))

  // 所有步骤
  const steps = fs.readdirSync('../src/steps/')

  // 遍历所有配置项，并生成属性配置项列表
  // for (const file of steps) {
  //   const [name, ext] = file.split('.')
  //   if (name !== 'index' && ext === 'ts') {
  //     if (!fs.existsSync(path.join(__dirname, `../src/steps/${name}.js`))) {
  //       spawnSync("tsc", [`../src/steps/${name}.ts`], {
  //         cwd: __dirname,
  //         shell: process.platform === 'win32'
  //       });
  //     }

  //     const step = { field: name, label: name, children: [] }
  //     config.children.push(step)
    
  //     const data = require(path.join(__dirname, `../src/steps/${name}.js`))
  //     await setConfig(data.Config.fields, step)
  //   }
  // }
  // fs.writeFileSync(path.join(__dirname, './config_analysis/fields.json'), JSON.stringify(config, undefined, 2))

  // 转换为矩形树图
  // const homeChar = (items) => {
  //   const list = []
  //   for (const item of items) {
  //     const data = { name: item.field, label: item.label }
  //     if (item.children) {
  //       data.children = homeChar(item.children)
  //     } else {
  //       data.value = 1
  //     }
  //     list.push(data)
  //   }
  //   return list
  // }
  // fs.writeFileSync(path.join(__dirname, './config_analysis/fields_chart.json'), JSON.stringify(homeChar(config.children), undefined, 2))

  // 处理步骤API
  if (!fs.existsSync(path.join(__dirname, `./config_analysis/apis`))) fs.mkdirSync(path.join(__dirname, `./config_analysis/apis`))
  if (!fs.existsSync(path.join(__dirname, `./config_analysis/apis/page-module`))) fs.mkdirSync(path.join(__dirname, `./config_analysis/apis/page-module`))
  if (!fs.existsSync(path.join(__dirname, `./config_analysis/apis/page-module/data`))) fs.mkdirSync(path.join(__dirname, `./config_analysis/apis/page-module/data`))
  for (const file of steps) {
    const [name, ext] = file.split('.')
    if (name !== 'index' && ext === 'ts') {
      const data = require(path.join(__dirname, `../src/steps/${name}.js`))
      const fields = data.Config.fields
      if (!fields) continue
      fields.shift()
      let apis = []
      try {
        apis = JSON.parse(fs.readFileSync(path.join(__dirname, `./config_analysis/apis/page-module/data/${name}.api.json`)).toString())
      } catch(e) {}
      fs.writeFileSync(path.join(__dirname, `./config_analysis/apis/page-module/data/${name}.api.json`), JSON.stringify(await setAPI(await getAPI(fields), apis), undefined, 2))
    }
  }

  // 清楚缓存数据
  // for (const file of temp) {
  //   fs.unlinkSync(path.join(__dirname, file));
  // }
};

main();