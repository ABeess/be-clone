const { FeathersError } = require("@feathersjs/errors");

class ExistOAuthUser extends FeathersError {
  constructor(message, data) {
    super(message, "NotAuthenticated", 301, "exist-oauth-user", data);
  }
}
class ExistEmail extends FeathersError {
  constructor(message, data) {
    super(message, "Conflict", 409, "email-taken", data);
  }
}
module.exports = {
  ExistOAuthUser,
  ExistEmail,
};
