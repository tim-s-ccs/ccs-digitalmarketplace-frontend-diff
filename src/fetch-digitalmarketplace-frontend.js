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
    `digitalmarketplace-frontend-${version}.tar.gz`
  );

  return new Promise(function (resolve, reject) {
    stream.pipeline(
      got.stream(
        `https://github.com/Crown-Commercial-Service/ccs-digitalmarketplace-govuk-frontend/archive/${version}.tar.gz`
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

async function fetchDigitalmarketplaceFrontend(version, options) {
  if (options.verbose) {
    console.log(`Fetching digitalmarketplace-frontend@${version}`);
  }
  const digitalmarketplaceFrontendPath = path.join(
    config.tempDirectory,
    version
  );

  if (options.forceRefresh) {
    console.log(
      'Refresh of digitalmarketplace-frontend requested, downloading from GitHub'
    );
  }

  if (
    !(
      fs.existsSync(digitalmarketplaceFrontendPath) &&
      fs.existsSync(path.join(digitalmarketplaceFrontendPath, 'package.json'))
    ) ||
    options.forceRefresh
  ) {
    mkdirp.sync(digitalmarketplaceFrontendPath);
    const tarballPath = await downloadTarball(version);
    await decompress(tarballPath, digitalmarketplaceFrontendPath, { strip: 1 });
  }
}

module.exports = fetchDigitalmarketplaceFrontend;
