const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const yargs = require('yargs');
const bodyParser = require('body-parser');
const config = require('../../src/config');

const { argv } = yargs.option('govuk-frontend-version').option('port');

const app = express();
const { port } = argv;
const govukFrontendVersion = argv['govuk-frontend-version'];

app.use(bodyParser.json());

const nunjucksEnv = new nunjucks.Environment([
  new nunjucks.FileSystemLoader(
    path.join(config.tempDirectory, govukFrontendVersion)
  ),
]);

app.post('/component/:component', (req, res) => {
  const data = req.body;

  const template = `{% from "src/govuk/components/${req.params.component}/macro.njk" import govuk${data.macro_name} %}
                      {{ govuk${data.macro_name}(params) }}`;

  res.send(nunjucksEnv.renderString(template, { params: data.params }).trim());
});

app.post('/template', (req, res) => {
  const data = req.body;

  const template = `
        {% extends "src/govuk/template.njk" %}
        {% block pageTitle %}{% if pageTitle %}{{ pageTitle }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block headIcons %} {% if headIcons %} {{ headIcons }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block head %} {% if head %} {{ head }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block bodyStart %} {% if bodyStart %} {{ bodyStart }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block skipLink %} {% if skipLink %} {{ skipLink }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block header %} {% if header %} {{ header }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block main %} {% if main %} {{ main }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block beforeContent %} {% if beforeContent %} {{ beforeContent }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block content %} {% if content %} {{ content }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block footer %} {% if footer %} {{ footer }} {% else %} {{ super() }} {% endif %} {% endblock %}
        {% block bodyEnd %} {% if bodyEnd %} {{ bodyEnd }} {% else %} {{ super() }} {% endif %} {% endblock %}
    `;

  res.send(nunjucksEnv.renderString(template, data).trim());
});

app.listen(port, () => process.send(`Ready`));
