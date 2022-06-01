const users = require("./users/users.service.js");
const courseCategory = require("./course-category/course-category.service.js");
const courseList = require("./course-list/course-list.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(courseCategory);
  app.configure(courseList);
};
