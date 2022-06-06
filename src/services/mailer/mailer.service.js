// Initializes the `mailer` service on path `/mailer`
const { Mailer } = require("./mailer.class");
const createModel = require("../../models/mailer.model");
const hooks = require("./mailer.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  app.use("/mailer", new Mailer(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("mailer");
  service.hooks(hooks);
};
