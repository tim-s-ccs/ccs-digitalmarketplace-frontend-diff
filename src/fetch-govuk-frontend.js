const stream = require('stream');
const fs = require('fs');
const path = require('path');
const got = require('got');
const decompress = require('decompress');
const mkdirp = require('mkdirp');
const config = require('./config');

async function downloadTarball(version) {
  const tarballPath = path.join(
    config.tempDirectory,
    `govuk-frontend-${version}.tar.gz`
  );

  return new Promise(function (resolve, reject) {
    stream.pipeline(
      got.stream(
        `https://github.com/alphagov/govuk-frontend/archive/${version}.tar.gz`
      ),
      fs.createWriteStream(tarballPath),
      function (err) {
        if (err) {
          reject(err);
        }

        resolve(tarballPath);
      }
    );
  });
}

async function fetchGovukFrontend(version, options) {
  if (options.verbose) {
    console.log(`Fetching govuk-frontend@${version}`);
  }
  const govukFrontendPath = path.join(config.tempDirectory, version);

  if (options.forceRefresh) {
    console.log('Refresh of govuk-frontend requested, downloading from GitHub');
  }

  if (
    !(
      fs.existsSync(govukFrontendPath) &&
      fs.existsSync(path.join(govukFrontendPath, 'package.json'))
    ) ||
    options.forceRefresh
  ) {
    mkdirp.sync(govukFrontendPath);
    const tarballPath = await downloadTarball(version);
    await decompress(tarballPath, govukFrontendPath, { strip: 1 });
  }
}

module.exports = fetchGovukFrontend;
