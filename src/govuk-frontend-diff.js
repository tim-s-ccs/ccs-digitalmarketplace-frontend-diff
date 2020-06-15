const nunjucks = require('nunjucks');
const ent = require('ent');
const expect = require('expect');
const path = require('path');
const fs = require('fs');
const cliProgress = require('cli-progress');
const prettyhtml = require('@starptech/prettyhtml');
const yaml = require('js-yaml');
const { HtmlDiffer } = require('@markedjs/html-differ');
const getGovukComponentList = require('./get-govuk-component-list');
const fetchGovukFrontend = require('./fetch-govuk-frontend');

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

async function diffComponentAgainstReferenceNunjucks(
  version,
  renderCallback,
  options
) {
  await fetchGovukFrontend(version, options);

  const components = getGovukComponentList(version, options);

  testProgress.start(components.length, 0);

  components.forEach((component) => {
    const examples = yaml.safeLoad(
      fs.readFileSync(
        path.join(
          '.govuk-frontend',
          version,
          'src/govuk/components',
          component,
          `${component}.yaml`
        ),
        'utf8'
      )
    );

    examples.examples.forEach((example) => {
      const expected = cleanHtml(
        nunjucks.render(
          path.join(
            '.govuk-frontend',
            version,
            'src/govuk/components',
            component,
            'template.njk'
          ),

          {
            params: example.data,
          }
        )
      );

      const actual = cleanHtml(renderCallback(component, example.data));

      // Make the actual comparison
      htmlDiffer
        .isEqual(actual, expected)
        .then((comparison) => {
          // If the comparison is false, then compare the strings so
          // that the person can eyeball the diff
          if (!comparison) {
            // console.log('------------------------------------------')
            // console.log(htmlDiffer.diffHtml(expected, actual))
            expect(actual).toBe(expected);
          }

          expect(comparison).toBe(true);
        })
        .catch((err) => {
          console.error(err);
        });
    });

    testProgress.increment();
  });

  testProgress.stop();
}

module.exports = diffComponentAgainstReferenceNunjucks;
