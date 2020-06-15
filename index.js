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
  .usage('Usage: govukFrontendDiff ./render.sh')
  .demandCommand(1)
  .demandOption(['govuk-frontend-version'])
  .option('force-refresh', {
    describe:
      'Force a re-download of govuk-frontend, bypassing the cache. Useful if the version you are specifying represents a branch',
  })
  .command(
    '<script>',
    'Tests the output of the provided render script against the govuk-frontend reference nunjucks',
    (yargs) => {
      yargs.positional('script', {
        normalize: true,
        describe:
          'script to use to render custom templates. This script must accept two arguments - component and params',
      });
    }
  );

performDiff(argv._[0], argv['govuk-frontend-version'], {
  forceRefresh: !!argv['force-refresh'],
});

// TODO: Get Jest back in properly - it's become a bit horrible without it
// TODO: Tidy up
// TODO: Test suite for this package + Github actions
// TODO: Pipeline to publish package
// TODO: Documentation
// TODO: Investigate bundling up with https://github.com/vercel/pkg
// TODO: Roll pull requests against govuk-react-jsx and govuk-frontend-jinja using this package
// TODO: Logging levels
// TODO: Document restriction that tool only works since the components were moved to src/govuk
