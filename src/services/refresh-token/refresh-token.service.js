// Initializes the `refresh-token` service on path `/refresh-token`
const { RefreshToken } = require("./refresh-token.class");
const createModel = require("../../models/refresh-token.model");
const hooks = require("./refresh-token.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/refresh-token",
    new RefreshToken(options, app),
    async (req, res, next) => {
      console.log("first");
      try {
        if (
          res?.hook?.params?.query?.logout?.toLowerCase() &&
          JSON.parse(res?.hook?.params?.query?.logout?.toLowerCase())
        ) {
          res.clearCookie("refreshToken");
          return next();
        }
        console.log(res?.hook?.params?.refreshToken);
        if (res?.hook?.params?.refreshToken) {
          res.cookie("refreshToken", res?.hook?.params?.refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 365,
          });
          return next();
        }
        return next();
      } catch (error) {
        next(error);
      }
    }
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("refresh-token");

  service.hooks(hooks);
};
