const path = require("path");
const process = require("process");
const webpack = require("../webpack.dev");

const express = require("express");
const app = express();

const spawn = require("child_process").spawn;

const server = spawn("webpack", ["serve", "--config", "./webpack.dev.js"], {
  cwd: path.join(__dirname, "../"),
  shell: process.platform === 'win32'
});
server.stdout.on("data", (data) => console.log(`${data}`));
server.stderr.on("data", (data) => console.log(`${data}`));
server.on("close", (code) =>
  console.log(`child process exited with code ${code}`)
);

const config = spawn("npm", ["run", "watch_config"], {
  cwd: path.join(__dirname, "../"),
  shell: process.platform === 'win32'
});
config.stdout.on("data", (data) => console.log(`${data}`));
config.stderr.on("data", (data) => console.log(`${data}`));
config.on("close", (code) =>
  console.log(`child process exited with code ${code}`)
);

const proxy = webpack.devServer.proxy.find((proxy) =>
  proxy.context.includes("/ccms/config/1.0.0/0/")
);
const port = proxy.target.match(/:(\d+)\/?/)[1];
console.log("port", port);

app.get("*", (req, res) => {
  const file = req.path.replace(/^\/ccms\/config\/[^\/]*\/[^\/]*\//, "");
  res.sendFile(path.join(__dirname, "../dist/config/", file));
});

app.listen(port, () => {
  console.log("config helper ready. port: " + port);
});
