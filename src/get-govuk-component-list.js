const path = require('path');
const glob = require('glob');

function getGovukComponentList(version, options) {
  const govukComponentPath = path.join(
    '.govuk-frontend',
    version,
    'src/govuk/components'
  );
  return glob
    .sync(path.join(govukComponentPath, '**/macro.njk'))
    .map((componentPath) =>
      path.relative(govukComponentPath, path.dirname(componentPath))
    );
}

module.exports = getGovukComponentList;
