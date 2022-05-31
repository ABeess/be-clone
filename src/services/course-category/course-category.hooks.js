const { authenticate } = require("@feathersjs/authentication").hooks;
const { softDelete, disablePagination } = require("feathers-hooks-common");
const search = require("feathers-mongodb-fuzzy-search");

module.exports = {
  before: {
    all: [
      // search({
      //   fields: ["name"],
      // }),
      softDelete(),
    ],
    find: [disablePagination()],
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
