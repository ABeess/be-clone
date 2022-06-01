// Author Tho Tran

module.exports = function search(context) {
  const param = context.params;
  if (param.query.$search) {
    const query = {};
    Object.keys(param.query.$search).map((item) => {
      query[item] = { $regex: new RegExp(param.query.$search[item]) };
    });
    context.params.query = { ...context.params.query, ...query };
  }
  return context;
};
