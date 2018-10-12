var fs = require("fs");

module.exports = async function getDiretories(src) {
  return await fs
    .readdirSync(src)
    .filter(dir => fs.statSync(src + "/" + dir).isDirectory());
};
