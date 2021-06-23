const path = require('path')

function defaultIndexTemplate(files) {
  const exportEntries = files.map(file => {
    const basename = path.basename(file, path.extname(file));
    const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename;
    return `export { default as ${exportName} } from "./${basename}";`;
  });
  return exportEntries.join("\n");
}

module.exports = defaultIndexTemplate;
