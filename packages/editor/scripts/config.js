const fs = require("fs");
const path = require("path");
const process = require("process");
const child_process = require("child_process");
const spawnSync = child_process.spawnSync;

const main = async () => {
  const history = fs.existsSync(path.join(__dirname, "./config.lock"))
    ? JSON.parse(fs.readFileSync(path.join(__dirname, "./config.lock")))
    : {};

  if (!fs.existsSync(path.join(__dirname, "../dist/config"))) {
    fs.mkdirSync(path.join(__dirname, "../dist/config"), { recursive: true });
  }

  const categoryList = fs.readdirSync(path.join(__dirname, "../src/config"));

  for (const category of categoryList) {
    const categoryPath = `../dist/config/${category}`;
    if (!fs.existsSync(path.join(__dirname, categoryPath))) {
      fs.mkdirSync(path.join(__dirname, categoryPath));
    }

    const fileList = fs.readdirSync(
      path.join(__dirname, `../src/config/${category}`)
    );

    for (const file of fileList) {
      const type = file.substr(file.length - 3);
      if (type === ".ts") {
        const name = file.substr(0, file.length - 3);
        const filePath = `../src/config/${category}/${name}`
        const targetPath = `../dist/config/${category}/${name}.json`
        const stats = fs.statSync(
          path.join(__dirname, `${filePath}.ts`)
        );

        if (history[`${category}/${name}`] !== stats.mtimeMs) {
          spawnSync("tsc", [`${filePath}.ts`], {
            cwd: __dirname,
            shell: process.platform === 'win32'
          });
          if (
            fs.existsSync(
              path.join(__dirname, `${filePath}.js`)
            )
          ) {
            const config = require(path.join(
              __dirname,
              `${filePath}.js`
            ));
            fs.writeFileSync(
              path.join(__dirname, targetPath),
              JSON.stringify(config.default)
            );
            fs.unlinkSync(
              path.join(__dirname, `${filePath}.js`)
            );
          }

          if (history[`${category}/${name}`]) {
            console.log(`${category}/${name} UPDATE`);
          } else {
            console.log(`${category}/${name} CREATE`);
          }

          history[`${category}/${name}`] = stats.mtimeMs;
        } else {
          console.log(`${category}/${name} SKIP`);
        }
      }
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "./config.lock"),
    JSON.stringify(history)
  );
};

main();
