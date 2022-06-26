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

const existAccountChecking = (rawUserData) => {
  return (
    rawUserData !== undefined &&
    rawUserData.password === process.env.DEFAULT_OAUTH_PASSWORD
  );
};
const OauthFlag = () => {
  let flag = false;
  return {
    getFlag: () => {
      return flag;
    },
    setFlag: (data) => {
      flag = !!data;
    },
  };
};
class GoogleStrategy extends OAuthStrategy {
  setup(app) {
    this.app = app;
  }
  async getEntityQuery(profile, params) {
    return { email: profile.email };
  }
  async getEntityData(profile, entity, params) {
    const baseData = await super.getEntityData(profile, entity, params);
    if (params?.existUser) {
      return baseData;
    }
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
  async findEntity(profile, params) {
    const entity = await super.findEntity(profile, params);
    params.existUser = entity;
    return entity;
  }
  async updateEntity(entity, profile, params) {
    if (!params?.existUser?.googleId) {
      return super.updateEntity(entity, profile, params);
    }
    return params?.existUser;
  }
}
class FacebookStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      profilePicture: profile.picture,
      email: profile.email,
    };
  }
}
class MyAuthenticationService extends AuthenticationService {
  setup(app) {
    this.app = app;
  }
  async getPayload(authResults, params) {
    const basePayload = await super.getPayload(authResults, params);
    const { user } = authResults;
    if (user) {
      const sub = user._id.toString();
      return {
        ...basePayload,
        role: user?.role,
        sub,
      };
    } else {
      return basePayload;
    }
  }
  async createAccessToken(payload) {
    if (OauthFlag().getFlag()) {
      return "exist_entity--no_token_response";
    }
    return super.createAccessToken(payload);
  }
  async authenticate(data, params, ...strategies) {
    const authResult = await super.authenticate(data, params, ...strategies);
    if (existAccountChecking(authResult)) {
      OauthFlag().setFlag(true);
      return {
        name: "NotAuthenticated",
        message: "Redirect to Oauth page",
        code: 409,
      };
    }
    return authResult;
  }
}
class MyLocalStrategy extends LocalStrategy {
  async authenticate(authentication, params) {
    const query = { $limit: 1, email: authentication?.email };
    const findRes = await this.entityService.find({ query });
    const rawUserData = findRes?.data?.[0];
    if (existAccountChecking(rawUserData)) {
      return rawUserData;
    }
    return super.authenticate(authentication, params);
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
        .find({ refreshToken, userId: payload?.userId || payload?.sub });
      if (refreshVerify?.sub && existRefreshToken?.data[0] !== undefined) {
        accessToken = await auth.createAccessToken({
          sub: payload.sub,
          role: payload.role,
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
  authentication.register("local", new MyLocalStrategy());
  authentication.register("google", new GoogleStrategy());
  authentication.register("facebook", new FacebookStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
