// Initializes the `lesson` service on path `/lesson`
const { Lesson } = require("./lesson.class");
const createModel = require("../../models/lesson.model");
const hooks = require("./lesson.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$search", "$regex"],
  };

  // Initialize our service with any options it requires
  app.use("/lesson", new Lesson(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("lesson");

  service.hooks(hooks);
};
