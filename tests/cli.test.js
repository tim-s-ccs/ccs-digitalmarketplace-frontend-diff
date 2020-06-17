const exec = require('child_process').execFileSync;

const command = process.env.GOVUK_FRONTEND_DIFF_COMMAND;
const os = require('os');

describe('govuk-frontend-diff cli', () => {
  it('outputs help message if no arguments supplied', () => {
    try {
      exec(command);
    } catch (error) {
      const lines = error.toString().split(os.EOL);
      lines.splice(0, 1);
      expect(lines.join('\n')).toMatchSnapshot();
    }
  });
});
