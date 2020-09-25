# Changelog

## Unreleased

#### Fixes

#### Features

#### Breaking changes

---

## Releases

### v1.1.1

- Fix broken `skip-hidden` functionality added in last version.

### v1.1.0

- Add `skip-hidden` cli option to allow you to skip tests using the "hidden" examples from govuk-frontend

### v1.0.1

#### Fixes

- Remove workaround for govuk examples which specified serviceName but not serviceUrl causing rendering differences. See https://github.com/alphagov/govuk-frontend/pull/1825

### v1.0.0

#### Fixes

- Fix progress bar racing ahead of what is actually happening under the hood (Now increments when the work is actually done, not just when queueing the promises)

### v0.8.1

#### Fixes

- Fix invalid skiplink context being passed to base page template

---

### v0.8.0

Initial release
