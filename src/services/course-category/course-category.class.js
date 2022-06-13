const { Service } = require("feathers-mongoose");

exports.CourseCategory = class CourseCategory extends Service {
  async patch(id, data, params) {
    if (!data?.parentId) {
      data.parentId = null;
    }
    return await super.patch(id, data, params);
  }
};
