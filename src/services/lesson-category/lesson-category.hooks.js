const { authenticate } = require("@feathersjs/authentication").hooks;
const { softDelete, disablePagination } = require("feathers-hooks-common");
const search = require("../../lib/mongoose-fuzzy-search");

module.exports = {
  before: {
    all: [softDelete()],
    find: [disablePagination(), search],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
