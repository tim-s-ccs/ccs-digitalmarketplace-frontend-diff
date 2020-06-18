const { exec } = require('child_process');

const command = process.env.GOVUK_FRONTEND_DIFF_COMMAND;

const run = function (args) {
  let execCli;

  const outputPromise = new Promise((resolve, reject) => {
    execCli = exec(`${command} ${args || ''}`, (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });

  const exitPromise = new Promise((resolve, reject) => {
    execCli.on('exit', (exitCode) => {
      resolve({ exitCode });
    });
  });

  return Promise.all([outputPromise, exitPromise]).then((output) => ({
    ...output[0],
    ...output[1],
  }));
};

describe('govuk-frontend-diff cli', () => {
  it('outputs help message if no arguments supplied', async (done) => {
    const { exitCode, stderr } = await run();
    expect(stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    done();
  });

  it('checks all pass when passing the Nunjucks reference templates back through it', (done) => {
    done();
  });

  it('all checks fail when passing nonsense output through it', async (done) => {
    done();
  });

  it('some checks fail when comparing latest govuk-frontend with an older version', (done) => {
    done();
  });

  it('can download other versions of govuk-frontend', (done) => {
    done();
  });

  it('forces a redownload of govuk-frontend when requested', (done) => {
    done();
  });

  it('can run a subset of the checks by excluding some', (done) => {
    done();
  });

  it('can run a subset of the checks by explicitly including some', (done) => {
    done();
  });

  it('throws an error if the passed render script throws an error', (done) => {
    done();
  });
});
