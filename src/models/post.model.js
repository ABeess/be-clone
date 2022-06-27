// post-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "post";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      content: { type: String, required: true },
      thumbnail: {
        url: { type: String, required: true, default: "" },
        id: { type: String, default: "no_id_Oauth" },
      },
      users: { type: Schema.Types.ObjectId, ref: "users" },
      comment: { type: Schema.Types.ObjectId, ref: "comments" },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
