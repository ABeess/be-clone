const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const {
  expressOauth,
  OAuthStrategy,
} = require("@feathersjs/authentication-oauth");

class MyAuthenticationService extends AuthenticationService {
  async getPayload(authResults, params) {
    const basePayload = await super.getPayload(authResults, params);
    return {
      ...basePayload,
      isAdmin: authResults?.user?.isAdmin,
    };
  }
}
class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      email: profile.email,
    };
  }
  // async getEntity(profile) {
  //   const baseEntity = await super.getEntity(profile);
  //   console.log(baseEntity);
  //   return {
  //     ...baseEntity,
  //   };
  // }
}

module.exports = (app) => {
  const authentication = new MyAuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new LocalStrategy());
  authentication.register("google", new GoogleStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
