const { exec, fork } = require('child_process');
const fetchDigitalmarketplaceFrontend = require('../src/fetch-digitalmarketplace-frontend');

const command = process.env.DIGITALMARKETPLACE_FRONTEND_DIFF_COMMAND;

jest.setTimeout(50000);

let childProcessPort = 3000;

const runServer = function (script, version) {
  childProcessPort += 1; // Increment port. Even when we exit the child process cleanly the port is not freed up in a timely manner

  const server = fork(script, [
    `--digitalmarketplace-frontend-version=${version}`,
    `--port=${childProcessPort}`,
  ]);

  return new Promise((resolve, reject) => {
    server.on('message', (data) => {
      if (data.indexOf('Ready') !== -1) {
        resolve([server, childProcessPort]);
      }
    });
  });
};

const runExampleServer = function (version) {
  return runServer('tests/utils/dummy-app.js', version);
};

const runNonsenseServer = function () {
  return runServer('tests/utils/nonsense-app.js', 'whatever');
};

const run = async function (args) {
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

describe('digitalmarketplace-frontend-diff cli', () => {
  it('outputs help message if no arguments supplied', async (done) => {
    const { exitCode, stdout, stderr } = await run();
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    done();
  });

  it('checks all pass when passing the Nunjucks reference templates back through it', async (done) => {
    const [server, port] = await runExampleServer('v3.7.0');

    const { exitCode, stdout, stderr } = await run(
      `http://localhost:${port} --digitalmarketplace-frontend-version=v3.7.0`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(0);

    server.kill();
    server.on('exit', done);
  });

  it('all checks fail when passing nonsense output through it', async (done) => {
    const [server, port] = await runNonsenseServer();

    const { exitCode, stdout, stderr } = await run(
      `http://localhost:${port} --hide-diffs --digitalmarketplace-frontend-version=v3.7.0`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    server.kill();
    server.on('exit', done);
  });

  it('some checks fail when comparing latest digitalmarketplace-frontend with an older version', async (done) => {
    await fetchDigitalmarketplaceFrontend('v3.5.0', {});

    const [server, port] = await runExampleServer('v3.5.0');

    const { exitCode, stdout, stderr } = await run(
      `http://localhost:${port} --digitalmarketplace-frontend-version=v3.7.0`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    server.kill();
    server.on('exit', done);
  });

  it('can run a subset of the checks by excluding some', async (done) => {
    const [server, port] = await runExampleServer('v3.7.0');

    const { exitCode, stdout, stderr } = await run(
      `http://localhost:${port} --digitalmarketplace-frontend-version=v3.7.0 --exclude button accordion page-template`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(0);

    server.kill();
    server.on('exit', done);
  });

  it('can run a subset of the checks by explicitly including some', async (done) => {
    const [server, port] = await runExampleServer('v3.7.0');

    const { exitCode, stdout, stderr } = await run(
      `http://localhost:${port} --digitalmarketplace-frontend-version=v3.7.0 --include button page-template`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(0);

    server.kill();
    server.on('exit', done);
  });

  it('throws an error if the passed render script throws an error', async (done) => {
    const [server] = await runExampleServer('v3.7.0');

    const { exitCode, stdout, stderr } = await run(
      `http:// --digitalmarketplace-frontend-version=v3.7.0`
    );
    expect(stdout + stderr).toEqual(
      expect.stringContaining('RequestError: getaddrinfo')
    );
    expect(exitCode).toEqual(1);

    server.kill();
    server.on('exit', done);
  });

  it('displays html diffs', async (done) => {
    await fetchDigitalmarketplaceFrontend('v3.0.0', {});

    const [server, port] = await runExampleServer('v3.0.0');

    const { exitCode, stdout, stderr } = await run(
      `http://localhost:${port} --digitalmarketplace-frontend-version=v3.7.0 --include button`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    server.kill();
    server.on('exit', done);
  });

  it('hides html diffs when requested', async (done) => {
    await fetchDigitalmarketplaceFrontend('v3.0.0', {});

    const [server, port] = await runExampleServer('v3.0.0');

    const { exitCode, stdout, stderr } = await run(
      `http://localhost:${port} --digitalmarketplace-frontend-version=v3.7.0 --include button --hide-diffs`
    );
    expect(stdout + stderr).toMatchSnapshot();
    expect(exitCode).toEqual(1);

    server.kill();
    server.on('exit', done);
  });
});
