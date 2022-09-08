/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const process = require('process')
const childProcess = require('child_process')

const { spawnSync } = childProcess

const main = async () => {
  const history = fs.existsSync(path.join(__dirname, './config.lock'))
    ? JSON.parse(fs.readFileSync(path.join(__dirname, './config.lock')))
    : {}

  if (!fs.existsSync(path.join(__dirname, '../config'))) {
    fs.mkdirSync(path.join(__dirname, '../config'), { recursive: true })
  }

  const categoryList = fs.readdirSync(path.join(__dirname, '../src/config'))

  for (const category of categoryList) {
    const categoryPath = `../config/${category}`
    if (!fs.existsSync(path.join(__dirname, categoryPath))) {
      fs.mkdirSync(path.join(__dirname, categoryPath))
    }

    const fileList = fs.readdirSync(path.join(__dirname, `../src/config/${category}`))

    for (const file of fileList) {
      const type = file.substring(file.length - 3)
      if (type === '.ts') {
        const name = file.substring(0, file.length - 3)
        const filePath = `../src/config/${category}/${name}`
        const targetPath = `../config/${category}/${name}.json`
        const stats = fs.statSync(path.join(__dirname, `${filePath}.ts`))

        if (history[`${category}/${name}`] !== stats.mtimeMs) {
          spawnSync('tsc', [`${filePath}.ts`], {
            cwd: __dirname,
            shell: process.platform === 'win32'
          })
          if (fs.existsSync(path.join(__dirname, `${filePath}.js`))) {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const config = require(path.join(__dirname, `${filePath}.js`))
            fs.writeFileSync(path.join(__dirname, targetPath), JSON.stringify(config.default))
            fs.unlinkSync(path.join(__dirname, `${filePath}.js`))
          }

          if (history[`${category}/${name}`]) {
            console.log(`${category}/${name} UPDATE`)
          } else {
            console.log(`${category}/${name} CREATE`)
          }

          history[`${category}/${name}`] = stats.mtimeMs
        } else {
          console.log(`${category}/${name} SKIP`)
        }
      }
    }
  }

  fs.writeFileSync(path.join(__dirname, './config.lock'), JSON.stringify(history))
}

main()
