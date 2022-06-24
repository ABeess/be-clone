const { Service } = require("feathers-mongoose");
const { GeneralError } = require("@feathersjs/errors");
const decode = require("jwt-decode");
exports.Users = class Users extends Service {
  setup(app) {
    this.app = app;
  }
  // async create(data, params) {
  //   if (data?.googleId || data?.facebookId) {
  //     return await super.create(data, params);
  //   }
  //   const { email } = data;
  //   try {
  //     if (JSON.parse(params.query.checking.toLowerCase())) {
  //       const existEmail = await this.Model.find({ email });
  //       if (existEmail[0] !== undefined)
  //         return new GeneralError(new Error("Email đã tồn tại!"));
  //       return "Redirect to verify page";
  //     } else {
  //       const isAdmin =
  //         params?.authentication &&
  //         params?.authentication.accessToken &&
  //         decode(params?.authentication?.accessToken)?.isAdmin
  //           ? true
  //           : false;
  //       if (isAdmin) {
  //         const existEmail = await this.Model.find({ email });
  //         if (existEmail[0] !== undefined)
  //           return new GeneralError(new Error("Email đã tồn tại!"));
  //         return await super.create(data, params);
  //       }
  //       const aliveCode = await this.app
  //         .service("mailer")
  //         .Model.find({ verifyCode: data.verifyCode });
  //       if (aliveCode[0] === undefined) {
  //         return new GeneralError(
  //           new Error("Mã xác thực của bạn không đúng hoặc đã hết hạn")
  //         );
  //       }
  //       return await super.create(data, params);
  //     }
  //   } catch (error) {
  //     return new GeneralError(new Error(error || "Lỗi hệ thống"));
  //   }
  // }
  async patch(id, data, params) {
    if (data?.googleId || data?.facebookId) {
      return await super.patch(id, data, params);
    }
    const { email } = data;
    try {
      if (
        params?.query?.checking &&
        JSON.parse(params?.query?.checking?.toLowerCase())
      ) {
        const existEmail = await this.Model.find({ email });
        if (existEmail[0] === undefined)
          return new GeneralError(
            new Error("Người dùng không tồn tại trong hệ thống!")
          );
        return "Redirect to verify page";
      } else {
        if (params?.user?.isAdmin) {
          return await super.patch(id, data, params);
        }
        const aliveCode = await this.app
          .service("mailer")
          .Model.find({ verifyCode: data.verifyCode });
        if (aliveCode[0] === undefined) {
          return new GeneralError(
            new Error("Mã xác thực của bạn không đúng hoặc đã hết hạn")
          );
        }
        return await super.patch(id, data, params);
      }
    } catch (error) {
      return new GeneralError(new Error(error || "Lỗi hệ thống!"));
    }
  }
};
