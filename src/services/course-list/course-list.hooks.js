const { authenticate } = require("@feathersjs/authentication").hooks;
const { softDelete, disablePagination } = require("feathers-hooks-common");
const search = require("../../lib/mongoose-fuzzy-search");

module.exports = {
  before: {
    all: [softDelete()],
    find: [disablePagination(), search],
    get: [],
    create: [authenticate("jwt")],
    update: [authenticate("jwt")],
    patch: [authenticate("jwt")],
    remove: [authenticate("jwt")],
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
