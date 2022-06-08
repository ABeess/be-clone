const users = require("./users/users.service.js");
const courseCategory = require("./course-category/course-category.service.js");
const courseList = require("./course-list/course-list.service.js");
const upload = require("./upload/upload.service.js");
const mailer = require("./mailer/mailer.service.js");
const refreshToken = require("./refresh-token/refresh-token.service.js");
const lessonCategory = require('./lesson-category/lesson-category.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(courseCategory);
  app.configure(courseList);
  app.configure(upload);
  app.configure(mailer);
  app.configure(refreshToken);
  app.configure(lessonCategory);
};
