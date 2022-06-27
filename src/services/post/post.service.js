// Initializes the `post` service on path `/post`
const { Post } = require("./post.class");
const createModel = require("../../models/post.model");
const hooks = require("./post.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$search", "$regex", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use("/post", new Post(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("post");

  service.hooks(hooks);
};
