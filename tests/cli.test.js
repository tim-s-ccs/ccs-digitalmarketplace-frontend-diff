const { exec } = require('child_process');

const command = process.env.GOVUK_FRONTEND_DIFF_COMMAND;

describe('govuk-frontend-diff cli', () => {
  it('outputs help message if no arguments supplied', (done) => {
    exec(command, (error, stdout, stderr) => {
      expect(stderr).toMatchSnapshot();
      done();
    });
  });
});
