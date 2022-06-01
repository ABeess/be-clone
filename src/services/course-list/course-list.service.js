// Initializes the `course-list` service on path `/course-list`
const { CourseList } = require("./course-list.class");
const createModel = require("../../models/course-list.model");
const hooks = require("./course-list.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$search", "$regex"],
  };

  // Initialize our service with any options it requires
  app.use("/course-list", new CourseList(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-list");

  service.hooks(hooks);
};
