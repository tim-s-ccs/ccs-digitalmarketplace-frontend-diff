const express = require('express');
const yargs = require('yargs');

const app = express();
const { argv } = yargs.option('port');
const { port } = argv;

app.post('/component/:component', (req, res) => {
  res.send('<p>Dummy html that will fail any test</p>');
});

app.post('/template', (req, res) => {
  res.send('<p>Dummy html that will fail any test</p>');
});

app.listen(port, () => process.send(`Ready`));
