// Author Tho Tran

const { isEmpty } = require("lodash");

module.exports = function search(context) {
  const param = context.params;
  if (param.query.$search) {
    const query = {};
    Object.keys(param.query.$search).map((item) => {
      if (!isEmpty(param.query.$search[item])) {
        query[item] = { $regex: new RegExp(param.query.$search[item]) };
      }
    });
    context.params.query = { ...context.params.query, ...query };
  }
  return context;
};
