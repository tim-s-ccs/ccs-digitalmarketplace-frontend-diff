const exec = require('child_process').execFileSync;

const command = process.env.GOVUK_FRONTEND_DIFF_COMMAND;

describe('govuk-frontend-diff cli', () => {
  it('outputs help message if no arguments supplied', () => {
    expect(() => {
      exec(command);
    }).toThrowErrorMatchingSnapshot();
  });
});
