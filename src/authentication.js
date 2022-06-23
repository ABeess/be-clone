const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const {
  expressOauth,
  OAuthStrategy,
} = require("@feathersjs/authentication-oauth");
const decode = require("jwt-decode");

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);
    console.log("getEntityData", baseData);
    // this will grab the picture and email address of the Google profile
    return {
      ...baseData,
      profilePhoto: {
        url: profile.picture,
      },
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.email,
    };
  }
}
class FacebookStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);

    // this will grab the picture and email address of the Google profile
    return {
      ...baseData,
      profilePicture: profile.picture,
      email: profile.email,
    };
  }
}
class MyAuthenticationService extends AuthenticationService {
  async getPayload(authResults, params) {
    const basePayload = await super.getPayload(authResults, params);
    return {
      ...basePayload,
      isAdmin: authResults?.user?.isAdmin,
    };
  }
}

class MyJWTStrategy extends JWTStrategy {
  setup(app) {
    this.app = app;
  }
  async authenticate(data, params) {
    const auth = new MyAuthenticationService(this.app);
    const payload = decode(data.accessToken);
    const time = new Date();
    const now = time.getTime();
    let accessToken = data?.accessToken;
    if (payload.exp * 1000 <= now) {
      const cookieInfo = params.headers?.cookie;
      const cookieTokenKey = "refreshToken=";
      const refreshToken = cookieInfo?.substring(
        cookieInfo?.indexOf(cookieTokenKey) + cookieTokenKey?.length
      );
      const refreshVerify = await auth.verifyAccessToken(
        refreshToken,
        {
          expiresIn: "1y",
        },
        process.env.SECRET_REFRESH_TOKEN
      );
      const existRefreshToken = await this.app
        .service("refresh-token")
        .find({ refreshToken, userId: payload?.sub });
      if (refreshVerify?.sub && existRefreshToken?.data[0] !== undefined) {
        accessToken = await auth.createAccessToken({
          sub: payload.sub,
          isAdmin: payload.isAdmin,
        });
      }
    }
    const authResults = await super.authenticate(
      {
        ...data,
        accessToken,
      },
      params
    );
    return authResults;
  }
}
module.exports = (app) => {
  const authentication = new MyAuthenticationService(app);

  authentication.register("jwt", new MyJWTStrategy());
  authentication.register("local", new LocalStrategy());
  authentication.register("google", new GoogleStrategy());
  authentication.register("facebook", new FacebookStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
