// Initializes the `lesson-category` service on path `/lesson-category`
const { LessonCategory } = require("./lesson-category.class");
const createModel = require("../../models/lesson-category.model");
const hooks = require("./lesson-category.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$search", "$regex"],
  };

  // Initialize our service with any options it requires
  app.use("/lesson-category", new LessonCategory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("lesson-category");

  service.hooks(hooks);
};
