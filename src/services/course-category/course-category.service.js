// Initializes the `course-category` service on path `/course-category`
const { CourseCategory } = require("./course-category.class");
const createModel = require("../../models/course-category.model");
const hooks = require("./course-category.hooks");
module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$search", "$regex"],
  };

  // Initialize our service with any options it requires
  app.use("/course-category", new CourseCategory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-category");
  service.hooks(hooks);
};
