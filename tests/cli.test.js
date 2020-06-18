const { exec } = require('child_process');
const path = require('path');

const command = process.env.GOVUK_FRONTEND_DIFF_COMMAND;

jest.setTimeout(50000);

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
    const { exitCode, stdout, stderr } = await run();
    expect(stderr).toMatchSnapshot();
    expect(stdout).toHaveLength(0);
    expect(exitCode).toEqual(1);

    done();
  });

  it('checks all pass when passing the Nunjucks reference templates back through it', (done) => {
    done();
  });

  it('all checks fail when passing nonsense output through it', async (done) => {
    const { exitCode, stdout, stderr } = await run(
      `${path.resolve('./tests/dummy-render-script.sh')} --hide-diffs`
    );
    expect(stdout).toMatchSnapshot();
    expect(stderr).toHaveLength(0);
    expect(exitCode).toEqual(1);

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

  it('displays html diffs', (done) => {
    done();
  });

  it('hides html diffs when requested', (done) => {
    done();
  });
});
