const { Service } = require("feathers-mongoose");
const { AuthenticationService } = require("@feathersjs/authentication");
const { GeneralError } = require("@feathersjs/errors");
exports.RefreshToken = class RefreshToken extends Service {
  setup(app) {
    this.app = app;
  }
  async create(data, params) {
    try {
      const { role, _id } = data;
      const authService = new AuthenticationService(this.app);
      const signRefreshToken = async () => {
        return await authService.createAccessToken(
          {
            sub: _id,
            role,
          },
          {
            expiresIn: "1y",
          },
          process.env.SECRET_REFRESH_TOKEN
        );
      };
      const refreshToken = await signRefreshToken();
      params.refreshToken = refreshToken;
      return await super.create({ refreshToken, userId: _id }, params);
    } catch (error) {
      return new GeneralError(new Error(error || "Lỗi hệ thống!"));
    }
  }
  async remove(id, params) {
    try {
      const cookieInfo = params.headers?.cookie;
      const cookieTokenKey = "refreshToken=";
      const clientRefreshToken = cookieInfo?.substring(
        cookieInfo?.indexOf(cookieTokenKey) + cookieTokenKey?.length
      );
      const existRefreshToken = await this.Model.findOne({
        userId: params?.query?.userId,
        refreshToken: clientRefreshToken,
      });
      return await super.remove(existRefreshToken?._id.toString(), params);
    } catch (error) {
      return new GeneralError(new Error(error || "Lỗi hệ thống!"));
    }
  }
};
