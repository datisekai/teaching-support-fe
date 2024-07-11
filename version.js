module.exports = "0.6.27";

const fs = require('fs');
const json = fs.readFileSync('./package.json').toString();
const version = JSON.parse(json)['version'];
const file = fs.readFileSync(__filename).toString();
const lines = file.split('\n');
lines.shift();
lines.unshift(`module.exports = "${version}";`);
fs.writeFileSync(__filename, lines.join('\n'));