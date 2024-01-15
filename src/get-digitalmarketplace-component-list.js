const path = require('path');
const glob = require('glob');
const config = require('./config');

function getDigitalmarketplaceComponentList(version) {
  const digitalmarketplaceComponentPath = path.join(
    config.tempDirectory,
    version,
    'src/digitalmarketplace/components'
  );
  return glob
    .sync(path.join(digitalmarketplaceComponentPath, '**/macro.njk'))
    .map((componentPath) =>
      path.relative(
        digitalmarketplaceComponentPath,
        path.dirname(componentPath)
      )
    );
}

module.exports = getDigitalmarketplaceComponentList;
