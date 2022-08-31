/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const process = require('process')
const express = require('express')
const { spawn } = require('child_process')
const webpack = require('../webpack.dev')

const app = express()

/** 修改文件，以支持本地源码调试 */
const toLocalDebug = (currentPath) => {
  const files = fs.readdirSync(currentPath, { withFileTypes: true })
  for (const file of files) {
    if (file.isDirectory()) {
      toLocalDebug(path.resolve(currentPath, file.name))
    } else {
      const ext = file.name.substring(file.name.indexOf('.'))
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        const content = fs.readFileSync(path.resolve(currentPath, file.name)).toString()
        console.log('content', content)
        break
      }
    }
  }
}
toLocalDebug(path.resolve(__dirname, '../src'))
return

const server = spawn('webpack', ['serve', '--config', './webpack.dev.js'], {
  cwd: path.join(__dirname, '../'),
  shell: process.platform === 'win32'
})
server.stdout.on('data', (data) => console.log(`${data}`))
server.stderr.on('data', (data) => console.log(`${data}`))
server.on('close', (code) => console.log(`child process exited with code ${code}`))

const config = spawn('npm', ['run', 'watch_config'], {
  cwd: path.join(__dirname, '../'),
  shell: process.platform === 'win32'
})
config.stdout.on('data', (data) => console.log(`${data}`))
config.stderr.on('data', (data) => console.log(`${data}`))
config.on('close', (code) => console.log(`child process exited with code ${code}`))

const proxy = webpack.devServer.proxy.find((currentProxy) => currentProxy.context.includes('/ccms/config/1.0.0/0/'))
const port = proxy.target.match(/:(\d+)\/?/)[1]
console.log('port', port)

app.get('*', (req, res) => {
  const file = req.path.replace(/^\/ccms\/config\/[^/]*\/[^/]*\//, '')
  res.sendFile(path.join(__dirname, '../dist/config/', file))
})

app.listen(port, () => {
  console.log(`config helper ready. port: ${port}`)
})
