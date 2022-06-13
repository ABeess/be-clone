// lesson-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "lesson";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: { type: String, required: true, lowercase: true },
      chapterId: {
        type: Schema.Types.ObjectId,
        ref: "lessonCategory",
        required: true,
      },
      order: { type: Number, required: true },
      slug: { type: String, required: true },
      description: { type: String, required: true },
      thumbnail: {
        url: { type: String, required: true, default: "" },
        id: { type: String, required: true, default: "" },
      },
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
