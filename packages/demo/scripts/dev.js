const getPort = require('get-port-cjs')
const path = require('path')
const fs = require('fs')
const express = require('express')
const process = require('process')
const { spawn } = require('child_process')

const app = express()

app.get('*', (req, res) => {
  const file = req.path.replace(/^\/ccms\/config\/[^/]*\/[^/]*\//, '')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendFile(path.join(__dirname, '../../editor/config/', file))
})

getPort({ port: 3001 }).then((port) => {
  app.listen(port, () => {
    fs.writeFileSync(path.join(__dirname, '../src/port.ts'), 'export default ' + port)
    console.log(`config helper ready. port: ${port}`)

    const server = spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, '../'),
      shell: process.platform === 'win32'
    })
    server.stdout.on('data', (data) => console.log(`${data}`))
    server.stderr.on('data', (data) => console.log(`${data}`))
    server.on('close', (code) => console.log(`child process exited with code ${code}`))
  })
})
