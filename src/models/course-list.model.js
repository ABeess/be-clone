// course-list-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "courseList";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      title: { type: String, required: true, lowwerCase: true },
      subTitle: { type: String, required: true },
      category: {
        type: Schema.Types.ObjectId,
        ref: "courseCategory",
        required: true,
      },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      description: { type: String, required: true },
      thumbnail: {
        url: { type: String, require: true },
        id: { type: String, require: true },
      },
      level: {
        type: String,
        enum: {
          values: ["Beginner", "Skilled", "Proficient", "Advanced"],
          message: "{VALUE} level is not supported",
        },
        required: true,
      },
      requirement: { type: String, required: true },
      deleted: { type: Boolean, default: false },
      deleteId: { type: Schema.Types.ObjectId, default: null },
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
