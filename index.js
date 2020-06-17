#!/usr/bin/env node

const yargs = require('yargs');
const exec = require('child_process').execFileSync;
const diffComponentAgainstReferenceNunjucks = require('./src/govuk-frontend-diff');

async function performDiff(script, version, options) {
  await diffComponentAgainstReferenceNunjucks(
    version,
    function (args) {
      let output;
      if (args.template) {
        output = exec(script, [
          '--template',
          '--params',
          JSON.stringify(args.params),
        ]);
      } else {
        output = exec(script, [
          '--component',
          args.component,
          '--params',
          JSON.stringify(args.params),
        ]);
      }

      return output.toString('utf8');
    },
    options
  );
}

const { argv } = yargs
  .usage('Usage: $0 ./render.sh --govuk-frontend-version=v3.7.0')
  .usage(
    'Usage: $0 ./render.sh --govuk-frontend-version=v3.7.0 --exclude=page-template'
  )
  .option('govuk-frontend-version', {
    describe: `Version of govuk-frontend to test against.    
    This will normally be references to tags like v3.7.0 but this will accept any commit-ish such as branches or even commit identifiers.
    If not specified, the most recent govuk-frontend tag will be used.`,
  })
  .option('force-refresh', {
    describe:
      'Force a re-download of govuk-frontend, bypassing the cache. Useful if the version you are specifying represents a branch such as if you were testing against master',
  })
  .option('include', {
    array: true,
    conflicts: 'exclude',
    describe: `Specify a subset of the tests to run. Should be one or more names of components, space separated
      
      For example --include accordion button
      `,
  })
  .option('exclude', {
    array: true,
    conflicts: 'include',
    describe:
      'Specify a subset of the tests to exclude. Should be one or more names of components, space separated',
  })
  .option('verbose', {
    type: 'boolean',
    alias: 'ci',
    describe:
      'Verbose logging instead of a simple progress bar. More suitable for CI situations where the progress bar is not useful.',
  })
  .command(
    '<script>',
    `Path to a script which will render your templates for each component/template/params combination.
    
    The html output from this script will then be compared against the reference Nunjucks templates.

    This script must:

    take --component and --params arguments (For rendering individual components)
      
    take --template and --params arguments (For rendering the base template)
      
    return the rendered html for a given template/component/params combo on stdout`
  )
  .demandCommand(1);

performDiff(argv._[0], argv['govuk-frontend-version'], {
  forceRefresh: !!argv['force-refresh'],
  include: argv.include,
  exclude: argv.exclude,
  verbose: argv.verbose,
});

// TODO: If the script dies, CI still passes (For example - remove pkg config from package.json so that nunjucks template is omitted. This will cause the script to fail but still pass CI)
// TODO: Add additional examples (Both manual and automatically generated worst case)
// TODO: Allow people to specify their own additional examples? (Maybe encourage them to submit pull requests to this repo if they use this option)
// TODO: Test suite for _this_ package - running tests against the binaries on their respective platforms as well as the raw nodejs cli
// TODO: Check it works on windows - are file paths ok as they are?
// TODO: Optimise promises in main script
// TODO: Catch promise rejections properly (Causes CI to pass even when there are errors)
// TODO: Documentation
// TODO: Create reference script for the render script which the tool requires
// TODO: Document restriction that tool only works since the components were moved to src/govuk (Basically version 3.0.0 upwards but need to confirm this)
// TODO: Check package.json version number against tag when publishing binaries - to ensure the command line version flag is correct
// TODO: Review all deps - which ones can we do without in order to slim the binary down?
// TODO: Don't love yargs. Try something else
// TODO: dependency scanning in pipeline. Scheduled job?
// TODO: General tidy up
// TODO: Publish to npm
// TODO: Roll pull requests against govuk-react-jsx and govuk-frontend-jinja using this package
