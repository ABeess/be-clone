// course-category-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "courseCategory";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      deleteId: { type: Schema.Types.ObjectId, default: null },
      deleted: { type: Boolean, default: false },
      name: { type: String, required: true, lowercase: true },
      parentId: {
        type: Schema.Types.ObjectId,
        ref: "courseCategory",
        default: null,
      },
      slug: { type: String, required: true, lowercase: true },
    },
    {
      timestamps: true,
    }
  );

  schema.index({ name: "text" });
  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
