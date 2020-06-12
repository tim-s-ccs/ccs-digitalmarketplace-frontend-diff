const nunjucks = require('nunjucks');
const ent = require('ent');
const expect = require('expect');
const cliProgress = require('cli-progress');
const prettyhtml = require('@starptech/prettyhtml');
const { HtmlDiffer } = require('@markedjs/html-differ');
const getGovukComponentList = require('./get-govuk-component-list');
const fetchGovukExamples = require('./fetch-govuk-frontend-examples');

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

async function diffComponentAgainstReferenceNunjucks(renderCallback) {
  const examples = await fetchGovukExamples();

  const components = getGovukComponentList();

  testProgress.start(components.length, 0);

  components.forEach((component) => {
    examples[component].examples.forEach((example) => {
      const expected = cleanHtml(
        nunjucks.render(
          require.resolve(
            `govuk-frontend/govuk/components/${component}/template.njk`
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
