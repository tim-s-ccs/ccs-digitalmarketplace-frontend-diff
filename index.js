#!/usr/bin/env node

const yargs = require('yargs');
const exec = require('child_process').execFileSync;
const diffComponentAgainstReferenceNunjucks = require('./src/govuk-frontend-diff');

async function performDiff(script, version, options) {
  await diffComponentAgainstReferenceNunjucks(
    version,
    function (component, params) {
      const output = exec(script, [
        '--component',
        component,
        '--params',
        JSON.stringify(params),
      ]);

      return output.toString('utf8');
    },
    options
  );
}

const { argv } = yargs
  .usage('Usage: $0 ./render.sh --govuk-frontend-version=v3.7.0')
  .option('govuk-frontend-version', {
    describe: `Version of govuk-frontend to test against.    
    This will normally be references to tags like v3.7.0 but this will accept any commit-ish such as branches or even commit identifiers`,
  })
  .option('force-refresh', {
    describe:
      'Force a re-download of govuk-frontend, bypassing the cache. Useful if the version you are specifying represents a branch such as if you were testing against master',
  })
  .command(
    '<script>',
    `Tests the output of the provided render script against the govuk-frontend reference nunjucks.

    This script must take --component and --params arguments, and return the html for a given component/params combo as rendered html on stdout`
  )
  .demandCommand(1)
  .demandOption(['govuk-frontend-version']);

performDiff(argv._[0], argv['govuk-frontend-version'], {
  forceRefresh: !!argv['force-refresh'],
});

// TODO: Get Jest back in properly - it's become a bit horrible without it
// TODO: Tidy up
// TODO: Test suite for this package
// TODO: Documentation
// TODO: Publish to npm
// TODO: Check package.json version number against tag when publishing binaries - to ensure the command line version flag is correct
// TODO: Roll pull requests against govuk-react-jsx and govuk-frontend-jinja using this package
// TODO: Logging levels
// TODO: Document restriction that tool only works since the components were moved to src/govuk
// TODO: Check it works on windows - are file paths ok as they are?
// TODO: Review all deps - which ones can we do without in order to slim the binary down?
// TODO: Allow people to restrict to a single component
// TODO: Tests for the base template
