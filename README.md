# govuk-frontend-diff

Command line tool to compare a custom implementation of govuk-frontend templates with the reference Nunjucks

## Installation

### Using the binaries

Binaries for OSX, Linux and Windows are provided. The [latest binaries can be found here](https://github.com/andymantell/govuk-frontend-diff/releases/latest).

Using the binaries does not require NodeJS to be installed.

_If you are have NodeJS available it is more optimal to run the script directly with NodeJS as shown below, since the binaries are quite large (Due to packaging up NodeJS and the required node_modules in the binary)._

### With NodeJS

If you wish, you can install govuk-frontend-diff globally: `npm install -g govuk-frontend-diff` or alternatively you can install it locally to your package and create a script entry in your package.json to run `govuk-frontend-diff` (Since npm automatically resolves paths to `node_modules/bin` scripts when they're run from package.json script entries).

#### Via npx

As with any cli tool published to the npm registry, you can simply run `npx govuk-frontend-diff`.

## Usage

```
Usage: govuk-frontend-diff ./render.sh --govuk-frontend-version=v3.7.0
Usage: govuk-frontend-diff ./render.sh --govuk-frontend-version=v3.7.0
--exclude=page-template

Commands:
  govuk-frontend-diff <script>
                     Path to a script which will render your templates for each
                     component/template/params combination.

                     The html output from this script will then be compared
                     against the reference Nunjucks templates.

                     This script must:

                     take --component and --params arguments (For rendering
                     individual components)

                     take --template and --params arguments (For rendering the
                     base template)

                     return the rendered html for a given
                     template/component/params combo on stdout

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
                            against master

  --include                 Specify a subset of the tests to run. Should
                            be one or more names of components, space
                            separated

                            For example --include accordion button
                                                                         [array]

  --exclude                 Specify a subset of the tests to exclude. Should be
                            one or more names of components, space separated
                                                                         [array]
```
