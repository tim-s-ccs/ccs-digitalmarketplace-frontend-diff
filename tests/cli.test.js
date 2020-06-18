const { exec } = require('child_process');

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
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    done();
  });

  it('checks all pass when passing the Nunjucks reference templates back through it', async (done) => {
    const { exitCode, stdout, stderr } = await run(
      `"node tests/utils/render-nunjucks.js --govuk-frontend-version=v3.7.0" --govuk-frontend-version=v3.7.0`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(0);
    done();
  });

  it('all checks fail when passing nonsense output through it', async (done) => {
    const { exitCode, stdout, stderr } = await run(
      `"node tests/utils/dummy-render-script.js" --hide-diffs --govuk-frontend-version=v3.7.0`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    done();
  });

  it('some checks fail when comparing latest govuk-frontend with an older version', async (done) => {
    const { exitCode, stdout, stderr } = await run(
      `"node tests/utils/render-nunjucks.js --govuk-frontend-version=v3.5.0" --govuk-frontend-version=v3.7.0`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);
    done();
  });

  it('can download other versions of govuk-frontend', async (done) => {
    done();
  });

  it('forces a redownload of govuk-frontend when requested', async (done) => {
    done();
  });

  it('can run a subset of the checks by excluding some', async (done) => {
    done();
  });

  it('can run a subset of the checks by explicitly including some', async (done) => {
    done();
  });

  it('throws an error if the passed render script throws an error', async (done) => {
    done();
  });

  it('displays html diffs', async (done) => {
    done();
  });

  it('hides html diffs when requested', async (done) => {
    done();
  });
});
