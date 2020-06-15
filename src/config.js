const path = require('path');
const os = require('os');
const fs = require('fs');

module.exports = {
  tempDirectory: path.join(fs.realpathSync(os.tmpdir()), 'govuk-frontend-diff'),
};
