const stream = require('stream');
const fs = require('fs');
const path = require('path');
const got = require('got');
const decompress = require('decompress');
const mkdirp = require('mkdirp');

async function downloadTarball(version) {
  const tarballPath = `.govuk-frontend/govuk-frontend-${version}.tar.gz`;

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
  console.log(`Fetching govuk-frontend@${version}`);
  const govukFrontendPath = path.join('.govuk-frontend', version);

  if (
    !(
      fs.existsSync(govukFrontendPath) &&
      fs.existsSync(path.join(govukFrontendPath, 'package.json'))
    ) ||
    options.forceRefresh
  ) {
    if (options.forceRefresh) {
      console.log(
        'Refresh of govuk-frontend requested, downloading from github'
      );
    } else {
      console.log('No cached copy found, downloading from github');
    }

    mkdirp.sync(govukFrontendPath);
    const tarballPath = await downloadTarball(version);
    await decompress(tarballPath, govukFrontendPath, { strip: 1 });
  } else {
    console.log('Cached copy found');
  }
}

module.exports = fetchGovukFrontend;
