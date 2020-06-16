const nunjucks = require('nunjucks');
const ent = require('ent');
const path = require('path');
const fs = require('fs');
const os = require('os');
const cliProgress = require('cli-progress');
const prettyhtml = require('@starptech/prettyhtml');
const yaml = require('js-yaml');
const chalk = require('chalk');
const { HtmlDiffer } = require('@markedjs/html-differ');
const diffLogger = require('@markedjs/html-differ/lib/logger');
const getGovukComponentList = require('./get-govuk-component-list');
const fetchGovukFrontend = require('./fetch-govuk-frontend');
const config = require('./config');

const htmlDiffer = new HtmlDiffer({
  ignoreAttributes: [],
  ignoreSelfClosingSlash: true,
});

const testProgress = new cliProgress.SingleBar(
  {
    format: 'Running tests {bar} {percentage}% | ETA: {eta}s | {value}/{total}',
  },
  cliProgress.Presets.shades_classic
);

function cleanHtml(dirtyHtml) {
  return prettyhtml(ent.decode(dirtyHtml), {
    sortAttributes: true,
  }).contents;
}

async function diffSingleComponentExample(
  component,
  example,
  renderCallback,
  nunjucksEnv
) {
  const expected = cleanHtml(
    nunjucksEnv.render(
      path.join('src/govuk/components', component, 'template.njk'),
      {
        params: example.data,
      }
    )
  );

  const actual = cleanHtml(renderCallback(component, example.data));

  const isEqual = await htmlDiffer.isEqual(actual, expected);

  const diff = await htmlDiffer.diffHtml(actual, expected);

  return new Promise((resolve, reject) => {
    resolve({
      passed: isEqual,
      example: example.name,
      diff,
    });
  });
}

async function diffSingleComponent(
  component,
  version,
  renderCallback,
  nunjucksEnv
) {
  testProgress.increment();

  const examples = yaml.safeLoad(
    fs.readFileSync(
      path.join(
        config.tempDirectory,
        version,
        'src/govuk/components',
        component,
        `${component}.yaml`
      ),
      'utf8'
    )
  );

  const results = await Promise.all(
    examples.examples.map((example) =>
      diffSingleComponentExample(
        component,
        example,
        renderCallback,
        nunjucksEnv
      )
    )
  );

  return new Promise(function (resolve, reject) {
    resolve({
      component,
      results,
    });
  });
}

async function diffComponentAgainstReferenceNunjucks(
  version,
  renderCallback,
  options
) {
  await fetchGovukFrontend(version, options);
  const components = getGovukComponentList(version, options);

  testProgress.start(components.length);

  const nunjucksEnv = new nunjucks.Environment([
    new nunjucks.FileSystemLoader(path.join(config.tempDirectory, version)),
  ]);

  const results = await Promise.all(
    components.map((component) =>
      diffSingleComponent(component, version, renderCallback, nunjucksEnv)
    )
  );

  testProgress.stop();

  let total = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  results.forEach((result) => {
    const groupName = chalk.whiteBright.bold(result.component);
    console.group(groupName);

    result.results.forEach((individualResult) => {
      total += 1;

      console.log(
        chalk.whiteBright.bold('→'),
        individualResult.example,
        individualResult.passed
          ? chalk.greenBright.bold('✔')
          : chalk.redBright.bold('✘')
      );
      if (individualResult.passed) {
        totalPassed += 1;
      } else {
        diffLogger.logDiffText(individualResult.diff, { charsAroundDiff: 80 });
        console.log(os.EOL);
        totalFailed += 1;
      }
    });

    console.groupEnd(groupName);
  });

  console.log(os.EOL);
  console.group(chalk.whiteBright.bold('Results'));
  console.log(total, ' tests.');
  console.log(
    chalk.greenBright(totalPassed),
    ' passed and ',
    chalk.redBright(totalFailed),
    ' failed'
  );
  console.groupEnd('Results');

  if (totalFailed > 0) {
    process.exitCode = 1;
  }
}

module.exports = diffComponentAgainstReferenceNunjucks;
