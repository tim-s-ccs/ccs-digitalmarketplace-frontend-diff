#!/usr/bin/env node

const yargs = require('yargs');
const exec = require('child_process').execFileSync;
const diffComponentAgainstReferenceNunjucks = require('./src/govuk-frontend-diff');

async function performDiff(script) {
  await diffComponentAgainstReferenceNunjucks(function (component, params) {
    const output = exec(script, [
      '--component',
      component,
      '--params',
      JSON.stringify(params),
    ]);

    return output.toString('utf8');
  });
}

const { argv } = yargs
  .usage('Usage: govukFrontendDiff ./render.sh')
  .demandCommand(1)
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

performDiff(argv._[0]);

// TODO: Make govuk-frontend version a configurable parameter
// TODO: Make the examples fetch script actually use the cache (Currently writes to it but doesn't use it)
