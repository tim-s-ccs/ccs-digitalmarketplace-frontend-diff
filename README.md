# govuk-frontend-diff

![Pipeline status](https://github.com/surevine/govuk-frontend-diff/workflows/Pipeline/badge.svg)
[![version](https://img.shields.io/npm/v/govuk-frontend-diff.svg?style=flat-square)](https://www.npmjs.com/package/govuk-frontend-diff)
[![MIT License](https://img.shields.io/npm/l/govuk-frontend-diff.svg?style=flat-square)](https://github.com/surevine/govuk-frontend-diff/blob/master/LICENSE)

Command line tool to compare a custom implementation of govuk-frontend templates with the reference Nunjucks

## Installation

### Using the binaries

Binaries for OSX, Linux and Windows are provided. The [latest binaries can be found here](https://github.com/surevine/govuk-frontend-diff/releases/latest).

Using the binaries does not require NodeJS to be installed.

_If you are have NodeJS available it is more optimal to run the script directly with NodeJS as shown below, since the binaries are quite large (Due to packaging up NodeJS and the required node_modules in the binary)._

### With NodeJS

If you wish, you can install govuk-frontend-diff globally: `npm install -g govuk-frontend-diff` or alternatively you can install it locally to your package and create a script entry in your package.json to run `govuk-frontend-diff` (Since npm automatically resolves paths to `node_modules/bin` scripts when they're run from package.json script entries).

#### Via npx

As with any cli tool published to the npm registry, you can simply run `npx govuk-frontend-diff`.

## Compatibility

Please note this tool will only work with versions of govuk-frontend later than `v3.0.0` (July 2019) wherein the components were moved underneath a `/govuk` subfolder. See https://github.com/alphagov/govuk-frontend/releases/tag/v3.0.0

## Usage

```
Usage: govuk-frontend-diff ./render.sh --govuk-frontend-version=v3.7.0
Usage: govuk-frontend-diff ./render.sh --govuk-frontend-version=v3.7.0
--exclude=page-template

Commands:
  govuk-frontend-diff <url>  URL to a server which will render your templates
                             for each component/template/params combination.

                             The html output from this will then be compared
                             against the reference Nunjucks templates.

                             This server must:

                             have /component/<component-name and /template
                             routes (POST)

Options:
  --help                    Show help                                  [boolean]
  --version                 Show version number                        [boolean]
  --govuk-frontend-version  Version of govuk-frontend to test against.
                            This will normally be references to tags like v3.7.0
                            but this will accept any commit-ish such as branches
                            or even commit identifiers.
                            If not specified, the most recent govuk-frontend tag
                            will be used.
  --force-refresh           Force a re-download of govuk-frontend, bypassing the
                            cache. Useful if the version you are specifying
                            represents a branch such as if you were testing
                            against master                             [boolean]
  --include                 Specify a subset of the tests to run. Should be one
                            or more names of components, space separated

                            For example --include accordion button       [array]
  --exclude                 Specify a subset of the tests to exclude. Should be
                            one or more names of components, space separated
                                                                         [array]
  --verbose, --ci           Verbose logging instead of a simple progress bar.
                            More suitable for CI situations where the progress
                            bar is not useful.                         [boolean]
  --hide-diffs              Hide the html diffs from output            [boolean]
  --ignore-attributes       Attributes to exclude from html diffing      [array]
```
