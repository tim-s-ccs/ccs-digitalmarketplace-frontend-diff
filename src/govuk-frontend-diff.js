const nunjucks = require('nunjucks');
const ent = require('ent');
const path = require('path');
const fs = require('fs');
// const cliProgress = require('cli-progress');
const prettyhtml = require('@starptech/prettyhtml');
const yaml = require('js-yaml');
// const assert = require('assert');
const { HtmlDiffer } = require('@markedjs/html-differ');
const diffLogger = require('@markedjs/html-differ/lib/logger');
const getGovukComponentList = require('./get-govuk-component-list');
const fetchGovukFrontend = require('./fetch-govuk-frontend');
const config = require('./config');

const htmlDiffer = new HtmlDiffer({
  ignoreAttributes: [],
  ignoreSelfClosingSlash: true,
});

// const testProgress = new cliProgress.SingleBar(
//   {
//     format: 'Running tests {bar} {percentage}% | ETA: {eta}s | {value}/{total}',
//   },
//   cliProgress.Presets.shades_classic
// );

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
  console.log('Rendering', component, example.name);
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

  console.log(isEqual ? '✔' : '✘');

  const diff = await htmlDiffer.diffHtml(actual, expected);
  const diffText = diffLogger.getDiffText(diff);

  return new Promise((resolve, reject) => {
    resolve({
      passed: isEqual,
      example: example.name,
      diff: diffText,
    });
  });
}

async function diffSingleComponent(
  component,
  version,
  renderCallback,
  nunjucksEnv
) {
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

  const nunjucksEnv = new nunjucks.Environment([
    new nunjucks.FileSystemLoader(path.join(config.tempDirectory, version)),
  ]);

  const results = await Promise.all(
    components.map((component) =>
      diffSingleComponent(component, version, renderCallback, nunjucksEnv)
    )
  );

  results.forEach((result) => {
    console.log(result.component);

    // TODO: Output results as we go, rather than waiting til end?

    result.results.forEach((individualResult) => {
      console.log(
        individualResult.passed ? '✔' : '✘',
        individualResult.example
      );
      if (!individualResult.passed) {
        console.log(individualResult.diff);
      }
    });
  });
}

module.exports = diffComponentAgainstReferenceNunjucks;
