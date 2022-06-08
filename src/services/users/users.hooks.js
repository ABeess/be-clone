const { authenticate } = require("@feathersjs/authentication").hooks;
const search = require("../../lib/mongoose-fuzzy-search");
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
const { softDelete, disablePagination } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [softDelete()],
    find: [authenticate("jwt"), disablePagination(), search],
    get: [authenticate("jwt")],
    create: [hashPassword("password")],
    update: [hashPassword("password"), authenticate("jwt")],
    patch: [hashPassword("password"), authenticate("jwt")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
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
